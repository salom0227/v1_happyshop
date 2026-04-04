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
  onchange="(function(input){{
    var fd=new FormData();
    fd.append('file', input.files[0]);
    fd.append('folder', 'products');
    var csrf = document.querySelector('[name=csrfmiddlewaretoken]');
    if(!csrf){{ alert('CSRF token topilmadi'); return; }}
    fd.append('csrfmiddlewaretoken', csrf.value);
    input.disabled=true;
    fetch('/api/upload/', {{method:'POST', body:fd}})
    .then(function(r){{
      return r.text().then(function(text){{
        try {{ return JSON.parse(text); }}
        catch(e) {{ alert('Server javobi: ' + text.substring(0,200)); throw e; }}
      }});
    }})
    .then(function(d){{
      if(d.url){{
        document.querySelector('[name=\\'{name}\\']').value=d.url;
        var ok=document.createElement('span');
        ok.style.color='green';
        ok.textContent=' ✅ Yuklandi!';
        input.parentNode.appendChild(ok);
      }} else {{
        alert('Xato: '+JSON.stringify(d));
      }}
      input.disabled=false;
    }}).catch(function(e){{ input.disabled=false; }});
  }})(this)" />
        ''', name=name)
        return format_html('{}{}{}', preview, url_input, script)
