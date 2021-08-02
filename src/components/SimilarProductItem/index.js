import {AiTwotoneStar} from 'react-icons/ai'

import './index.css'

const SimilarProductItem = props => {
  const {productItem} = props
  const {imageUrl, brand, price, rating, title} = productItem

  return (
    <div className="similar-content">
      <img
        className="similar-product-img"
        alt={`similar product${title}`}
        src={imageUrl}
      />
      <p className="similar-product-title">{title}</p>
      <p className="similar-product-brand">{brand}</p>
      <div className="price-rating-container">
        <p className="similar-product-price">Rs {price}/- </p>
        <p className="similar-product-rating">
          {rating} <AiTwotoneStar />
        </p>
      </div>
    </div>
  )
}

export default SimilarProductItem
