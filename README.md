# KiOferta

Banco coletivo de preços de supermercado. Projeto modelo da disciplina de
Programação para Dispositivos Móveis (FATEC): SPA em JavaScript puro,
empacotada como app com o Capacitor.

O desenho das telas está em [ki-oferta.pdf](ki-oferta.pdf) (estudo de caso de interface).
O padrão de código que todo app da disciplina segue está em [PADRAO.md](PADRAO.md).

## Como rodar

```bash
npm install
npm run dev        # desenvolvimento, com recarga automática
npm run build      # gera dist/, usada pelo Capacitor
npm run preview    # testa o build em http://localhost:4173
```

## As onze telas

| Tela | Endereço | Menu | Quem usa |
|---|---|---|---|
| 1 Início | `#buscar` | Buscar | todos |
| 2 Resultado da busca | `#produtos?busca=café&categoria=Mercearia&ordem=distancia` | | todos |
| 3 Detalhe do produto | `#produto?id=1` | | todos |
| 4 Mapa | `#mapa` ou `#mapa?produto=1` | Mapa | todos |
| 5 Mercado | `#mercado?id=1` | | todos |
| 6 Favoritos | `#favorito` | Favoritos | todos (salvos no aparelho) |
| 7 Cadastro e login | `#login?aba=entrar&volta=enviar` | | contribuinte |
| 8 Conta pendente | `#pendente` | | contribuinte |
| 9 Enviar promoção | `#enviar` | Enviar | contribuinte aprovado |
| 10 Minhas contribuições | `#conta` | Conta | contribuinte aprovado |
| 11 Painel de contas | `#moderacao` | | moderador |
| Tela não encontrada | qualquer outro | | |
| Sorteio dos temas | `#sorteio` | | professor |

## Contas de teste

| E-mail | Senha | Situação |
|---|---|---|
| marina@kioferta.com | marina123 | contribuinte, 128 de reputação (vai para votação) |
| rafael@kioferta.com | rafael123 | contribuinte, 212 de reputação (publica direto) |
| caio@kioferta.com | caio1234 | moderador |
| juliana@email.com | juliana123 | pendente (aprove no painel com o Caio) |

A sessão e os dados ficam na memória: recarregou o app, tudo volta ao início.
Só os favoritos ficam salvos no aparelho.

## Serviços externos (aula 9)

| Onde | Serviço | O que faz |
|---|---|---|
| Tela 9, código de barras | Open Food Facts | identifica produto que não está no catálogo |
| Tela 7, campo cidade | ViaCEP | digitou um CEP, a cidade é preenchida |

## O backend

A KiOferta API (repositório `kioferta-python`, FastAPI, sem banco de dados) já
tem uma rota para cada tela. Quando o app passar a usá-la, só
`servicos/catalogo.js` e `servicos/contas.js` mudam: eles passam a pedir ao
`http.js`. As telas, o roteador e a navbar continuam iguais.

## Lacunas do estudo de caso

O que o enunciado não define continua sem regra inventada:

- **Contestação**: o botão existe e avisa que a regra ainda não foi definida.
- **Filtro por distância**: a busca ordena por distância, mas não limita por raio.
- **Mapa real e GPS**: o mapa é ilustrativo e a distância vem dos dados de exemplo.
- **Leitor de código pela câmera**: o atalho leva ao campo onde o código é digitado.

## Testes das telas

`testes/telas.mjs` percorre os fluxos das onze telas no navegador, com os
serviços externos simulados, e guarda uma foto de cada tela.

```bash
npm install -D playwright
npx playwright install chromium
npm run build
npm run preview          # deixe rodando em um terminal
node testes/telas.mjs    # em outro terminal
```
