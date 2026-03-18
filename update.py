import re

with open('d:\\my_portfolio-1\\index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'/\* ===== SKILL BARS ===== \*/.*?/\* ===== CERTS ===== \*/', '/* ===== CERTS ===== */', text, flags=re.DOTALL)

script_tag = '''<script type="module">
        import ClientController from './js/controllers/ClientController.js';
        document.addEventListener('DOMContentLoaded', () => {
            const clientApp = new ClientController();
            clientApp.init();
        });
    </script>
</body>'''

text = text.replace('</body>', script_tag)

with open('d:\\my_portfolio-1\\index.html', 'w', encoding='utf-8') as f:
    f.write(text)
