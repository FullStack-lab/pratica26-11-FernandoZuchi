import React from 'react'

const ProductCard = ({ product }) => {
  return (
    <div>
        <img src={product.imageUrl} alt='Imagem retangular de um teclado gamer preto'/>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>{product.price}</p>
    </div>
  )
}

export default ProductCard