from django import forms
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
        script = format_html('''
<input type="file" accept="image/*" style="margin-top:6px;display:block;"
  onchange="
    var fd=new FormData();
    fd.append('file',this.files[0]);
    fd.append('folder','{name}');
    fd.append('csrfmiddlewaretoken',document.cookie.match(/csrftoken=([^;]+)/)[1]);
    this.disabled=true;
    fetch('/api/upload/',{{method:'POST',body:fd}})
    .then(r=>r.json()).then(d=>{{
      if(d.url){{
        document.querySelector('[name=\\'{name}\\']').value=d.url;
        this.after(Object.assign(document.createElement('span'),{{textContent:' Yuklandi!'}}));
      }}
      this.disabled=false;
    }}).catch(()=>{{this.disabled=false;}});
  " />
        ''', name=name)
        return format_html('{}{}{}', preview, url_input, script)
