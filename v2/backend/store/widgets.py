import os
from django import forms
from django.conf import settings
from django.utils.html import format_html


class SupabaseImageWidget(forms.TextInput):
    def render(self, name, value, attrs=None, renderer=None):
        url_input = super().render(name, value, attrs, renderer)
        preview = ''
        if value:
            preview = format_html(
                '<div style="margin:4px 0"><img src="{}" style="max-height:80px;max-width:120px;object-fit:contain;border-radius:4px;" /></div>',
                value
            )
        upload_field = format_html(
            '<input type="file" accept="image/*" style="margin-top:6px;display:block;" onchange="supabaseUpload(this,\'{}\')" />',
            name
        )
        script = '''<script>
function supabaseUpload(input, fieldName) {
    const file = input.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const fileName = Date.now() + '_' + Math.random().toString(36).substr(2,6) + '.' + ext;
    const path = fieldName + '/' + fileName;
    const SUPABASE_URL = "https://vsubrvakueksfxnqvwpz.supabase.co";
    const SUPABASE_KEY = "''' + os.getenv('SUPABASE_SECRET_KEY', '') + '''";
    const url = SUPABASE_URL + "/storage/v1/object/media/" + path;
    input.disabled = true;
    input.after(Object.assign(document.createElement('span'), {textContent: ' Yuklanmoqda...', id: 'up_'+fieldName}));
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': file.type,
            'x-upsert': 'true'
        },
        body: file
    }).then(r => r.json()).then(data => {
        const publicUrl = SUPABASE_URL + "/storage/v1/object/public/media/" + path;
        document.querySelector('[name="' + fieldName + '"]').value = publicUrl;
        const sp = document.getElementById('up_'+fieldName);
        if (sp) sp.textContent = ' Yuklandi!';
        input.disabled = false;
    }).catch(e => {
        const sp = document.getElementById('up_'+fieldName);
        if (sp) sp.textContent = ' Xato!';
        input.disabled = false;
        console.error(e);
    });
}
</script>'''
        return format_html('{}{}{}{}', preview, url_input, upload_field, script)
