# Imagens do Portal de Carreiras

O portal já está preparado para receber fotos institucionais. Enquanto elas não forem adicionadas, cada seção exibe um visual provisório (degradê e ícones), então **nada quebra se a imagem não existir**.

Todas as imagens são configuradas em um único arquivo: [`src/config/images.ts`](../src/config/images.ts).

---

## Imagens necessárias

| Chave        | Onde aparece                                        | Tamanho recomendado | Proporção | O que fotografar                                                                                 |
| ------------ | --------------------------------------------------- | ------------------- | --------- | ------------------------------------------------------------------------------------------------ |
| `hero`       | Fundo do banner principal (topo da página)          | 2400 × 1200 px      | 2:1       | Equipe uniformizada, fachada de uma base ou colaborador em posto. Foto **horizontal e ampla**.  |
| `talentBank` | Coluna direita do bloco "Banco de Talentos" (desktop) | 1200 × 900 px     | 4:3       | Colaborador em atividade (portaria, ronda, limpeza) ou equipe em treinamento.                    |

### Observações sobre cada uma

- **`hero`**: a foto recebe automaticamente uma camada azul-marinho por cima (~85% de opacidade) para manter a identidade visual e a leitura do texto branco. Por isso, prefira fotos **sem texto** e com o assunto principal distribuído — o centro fica coberto pelo título.
- **`talentBank`**: aparece apenas em telas a partir de 900px de largura (no celular a coluna é ocultada). É exibida com cantos arredondados e cortada em `object-fit: cover`, então mantenha o assunto centralizado.

---

## Como adicionar uma imagem

1. **Otimize o arquivo** antes de colocar no projeto:
   - Formato: **WebP** (ou JPG com qualidade ~80).
   - Peso alvo: **até 250KB** para o `hero` e **até 150KB** para o `talentBank`.
   - Ferramenta gratuita: [squoosh.app](https://squoosh.app).

2. **Salve o arquivo** em `src/assets/images/` (crie a pasta se não existir):

   ```
   src/assets/images/hero.webp
   src/assets/images/banco-talentos.webp
   ```

3. **Importe no arquivo de configuração** `src/config/images.ts`:

   ```ts
   import heroImg from "../assets/images/hero.webp";
   import talentBankImg from "../assets/images/banco-talentos.webp";

   export const siteImages: {
     hero: string | null;
     talentBank: string | null;
   } = {
     hero: heroImg,
     talentBank: talentBankImg,
   };
   ```

4. Rode `npm run dev`, confira no desktop e no celular, depois `npm run build` antes do commit.

Para voltar ao visual provisório, basta trocar o valor de volta para `null`.

---

## ⚠️ LGPD e direitos de imagem

- Fotos com **colaboradores identificáveis** exigem **autorização de uso de imagem por escrito** de cada pessoa que aparece.
- Evite placas de veículos, documentos, crachás legíveis ou telas de monitoramento visíveis — especialmente em fotos de postos de segurança e portaria.
- Se usar banco de imagens (Unsplash, Pexels), confirme que a licença permite **uso comercial** e guarde o link de origem.
