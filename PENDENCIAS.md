# Como usar este projeto

## Versão de demonstração (atual)

`index.html` é uma **demo para apresentar a clientes**. A profissional "Marina Alves", o CRN-3 00000, os textos e as fotos são fictícios, e o rodapé avisa isso.
Instagram e e-mail aparecem só como texto: os links levam à seção Contato e não abrem perfis reais.

Não publique a demo como se fosse o site de uma profissional real.

## Ao fechar com uma cliente real

1. Use `index-modelo.html`, que é a mesma página com todos os dados marcados como `[PREENCHER: ...]`. Ele fica no repositório, mas não é publicado: está excluído em `_config.yml` (GitHub Pages) e em `.vercelignore` (Vercel), assim como este arquivo. Renomeie para `index.html` e remova a linha `<meta name="robots" content="noindex">`.
2. Preencha os itens abaixo. Para achá-los, busque por **PREENCHER** em `index.html`, `politica-de-privacidade.html` e `js/main.js`.
   Na tela, os marcadores aparecem com fundo terracota claro (classe `.fill`). Ao preencher, troque o `<span class="fill">[...]</span>` pelo texto real.
3. Troque todas as fotos pelas fotos reais da profissional.
4. Revise a Política de Privacidade: ela está com os dados da demo (nome, CRN, e-mail e o aviso "Site demonstrativo").
5. Em `js/main.js`, preencha `CONFIG.whatsapp` e `CONFIG.nome`.


## Editando o visual (importante)

O CSS fica **embutido** dentro das páginas para o site abrir mais rápido no celular.
Edite sempre `css/style.css` e depois rode:

```bash
node build.js
```

O script copia o CSS (minificado) para `index.html`, `index-modelo.html` e `politica-de-privacidade.html`. Não edite o bloco `<style>` dentro dos HTML: ele é sobrescrito.
As fontes (Fraunces e Manrope, licença OFL) ficam em `fonts/`.

# Pendências: o que a profissional precisa enviar

## Dados

- [ ] Nome profissional (header, hero, cartão da foto, títulos, rodapé, SEO)
- [ ] Nome completo (rodapé, política de privacidade, dados estruturados)
- [ ] CRN: região e número
- [ ] Cidade / estado (título da página e meta description)
- [ ] Endereço do consultório, se houver atendimento presencial (contato, rodapé, FAQ, dados estruturados, mapa)
- [ ] Modalidades: presencial, online ou ambas (seção Atendimentos, select do formulário, FAQ)
- [ ] Áreas de atuação reais, cada uma com uma descrição curta (3 cartões; duplique ou remova)
- [ ] Serviços oferecidos: nome, descrição, para quem é indicado e como funciona (2 cartões)
- [ ] Texto de apresentação em primeira pessoa (Sobre mim)
- [ ] Frase sobre a filosofia de trabalho
- [ ] Formação acadêmica (curso, instituição, ano)
- [ ] Pós-graduações e especializações
- [ ] Cursos e qualificações relevantes
- [ ] Experiência profissional
- [ ] Como funciona a primeira consulta (etapa 02 e FAQ)
- [ ] Como as orientações são construídas (etapa 03)
- [ ] Como funciona o acompanhamento, se oferecido (etapa 04 e FAQ; remova se não houver)
- [ ] Como funciona o atendimento online, se houver (FAQ)
- [ ] WhatsApp com DDD: em `js/main.js` → `CONFIG.whatsapp` (ex.: `5511999998888`) e no JSON-LD
- [ ] Instagram (usuário)
- [ ] E-mail
- [ ] Domínio do site (canonical, Open Graph, dados estruturados)
- [ ] Revisão da Política de Privacidade (data, CPF/CNPJ se aplicável, prazo de retenção, serviços usados)

## Fotos

As fotos atuais são **exemplos** do Unsplash (licença gratuita), servidas direto de `images.unsplash.com`.
Elas servem só para apresentar o layout. **Antes de publicar, troque todas pelas fotos reais da profissional**, conforme a direção de arte.

| Onde | Exemplo atual | Enviar |
|---|---|---|
| Hero | modelo de jaleco com a mão no queixo | foto vertical da profissional (rosto e ombros, luz natural), de preferência recortada sem fundo |
| Hero (detalhe redondo) | tigela de salada | foto pequena de alimento (opcional) |
| Sobre mim | modelo de jaleco (segunda foto) | **outra** foto vertical da profissional, diferente da do hero |
| Contato (avatar) | modelo de jaleco | retrato quadrado (rosto) |
| Atendimentos (2) | mãos cortando repolho; salada em pote | fotos complementares naturais, uma por serviço |
| Minha abordagem | verduras sobre fundo claro | alimentos ou ambiente do consultório, vertical |
| Conteúdos (3) | tigelas de café da manhã; salada; granola | imagens dos conteúdos reais |
| Compartilhamento (Open Graph) | — | foto da profissional 1200×630 → `img/og-profissional.jpg` |

Para cada foto real: exporte em WebP/AVIF nos tamanhos 480, 800 e 1200 px de largura, salve em `img/` e use os blocos `<source>` comentados no hero como modelo. Depois, remova o `preconnect` de `images.unsplash.com` no `<head>`.

Os placeholders em SVG (`img/placeholder-*.svg`) ficam como reserva, caso alguma foto não seja enviada.

## Opcional

- [ ] Seção **Conteúdos**: os textos são exemplos. Para ocultar a seção, adicione `hidden` na tag `<section id="conteudos">`.
- [ ] Formulário via Formspree em vez do WhatsApp: veja o comentário em `js/main.js`.
- [ ] Mapa do Google: descomente o bloco `.map` na seção Contato (somente se houver atendimento presencial).
- [ ] Se não houver consultório, remova o segundo bloco de dados estruturados (`MedicalBusiness`) no `<head>`.

## Pré-visualizar localmente

```bash
node .claude/serve.js
```

Depois, abra http://localhost:5510.
