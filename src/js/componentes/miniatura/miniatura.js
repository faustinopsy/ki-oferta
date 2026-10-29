import './miniatura.css'
import { escapar } from '../../util/formatos.js'

// Foto do produto ou da etiqueta. Sem foto, mostra um ícone no lugar.
function miniatura({ imagem = '', icone = 'image', rotulo = '', pequena = false }) {
  const classe = `miniatura${pequena ? ' miniatura--pequena' : ''}`
  if (imagem) {
    return `<img class="${classe}" src="${escapar(imagem)}" alt="${escapar(rotulo)}">`
  }
  return `<span class="${classe} miniatura--vazia" role="img" aria-label="${escapar(rotulo)}">
            <i data-lucide="${icone}"></i>
          </span>`
}

export { miniatura }
