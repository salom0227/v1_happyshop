import uuid
import requests
from django import forms
from django.conf import settings
from django.utils.html import format_html


class SupabaseImageWidget(forms.TextInput):
    """URLField uchun — rasm yuklash + URL ko'rsatish."""

    def render(self, name, value, attrs=None, renderer=None):
        url_input = super().render(name, value, attrs, renderer)
        preview = ''
        if value:
            preview = format_html(
                '<div style="margin:4px 0"><img src="{}" style="max-height:80px;max-width:120px;object-fit:contain;border-radius:4px;" /></div>',
                value
            )
        upload_input = format_html(
            '<input type="file" accept="image/*" style="margin-top:6px;display:block;" '
            'onchange="uploadToSupabase(this, \'{name}\')" />',
            name=name
        )
        script = format_html('''
        <script>
        function uploadToSupabase(input, fieldName) {{
            const file = input.files[0];
            if (!file) return;
            const ext = file.name.split('.').pop();
            const fileName = Math.random().toString(36).substring(2) + '.' + ext;
            const folder = fieldName.includes('image') ? fieldName : 'misc';
            const path = folder + '/' + fileName;
            const url = "{supabase_url}/storage/v1/object/media/" + path;
            const btn = input.nextElementSibling;
            if (btn) btn.textContent = 'Yuklanmoqda...';
            fetch(url, {{
                method: 'POST',
                headers: {{
                    'Authorization': 'Bearer {supabase_key}',
                    'Content-Type': file.type,
                    'x-upsert': 'true'
                }},
                body: file
            }}).then(r => r.json()).then(data => {{
                const publicUrl = "{supabase_url}/storage/v1/object/public/media/" + path;
                document.querySelector('[name="' + fieldName + '"]').value = publicUrl;
                if (btn) btn.textContent = '✅ Yuklandi!';
                const img = input.closest('td, .field-image')?.querySelector('img');
                if (img) img.src = publicUrl;
            }}).catch(e => {{
                if (btn) btn.textContent = '❌ Xato!';
                console.error(e);
            }});
        }}
        </script>
        ''',
            supabase_url=getattr(settings, 'AWS_S3_ENDPOINT_URL', ''),
            supabase_key=getattr(settings, 'AWS_ACCESS_KEY_ID', '')
        )
        return format_html('{}{}{}{}', preview, url_input, upload_input, script)
