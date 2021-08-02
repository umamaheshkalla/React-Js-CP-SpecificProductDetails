import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiTwotoneStar} from 'react-icons/ai'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    addItem: 1,
    productsData: {},
    similarProductItems: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        availability: data.availability,
        id: data.id,
        imageUrl: data.image_url,
        description: data.description,
        brand: data.brand,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      const updatedSimilarProducts = data.similar_products.map(eachItem => ({
        availability: eachItem.availability,
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        description: eachItem.description,
        brand: eachItem.brand,
        price: eachItem.price,
        rating: eachItem.rating,
        title: eachItem.title,
        totalReviews: eachItem.total_reviews,
      }))
      this.setState({
        productsData: updatedData,
        similarProductItems: updatedSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onIncrement = () => {
    this.setState(prevState => ({addItem: prevState.addItem + 1}))
  }

  onDecrement = () => {
    const {addItem} = this.state
    if (addItem > 1) {
      this.setState(prevState => ({addItem: prevState.addItem - 1}))
    }
  }

  renderSuccessView = () => {
    const {productsData, addItem, similarProductItems} = this.state
    const {
      availability,
      imageUrl,
      description,
      brand,
      price,
      rating,
      title,
      totalReviews,
    } = productsData
    return (
      <div>
        <div className="productDetail-container">
          <img className="product-image" alt="product" src={imageUrl} />
          <div className="productItem-content">
            <h1 className="product-heading">{title}</h1>
            <p className="price">RS {price}/-</p>
            <div className="ratings-views">
              <p className="rating">
                {rating} <AiTwotoneStar />
              </p>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="available-container">
              <p className="sub-heading">Available : </p>
              <p className="span">{availability}</p>
            </div>
            <div className="available-container">
              <p className="sub-heading">Brand : </p>
              <p className="span">{brand}</p>
            </div>
            <hr className="horizontal-line" />
            <div className="quantity-block">
              <button
                className="update-button"
                type="button"
                onClick={this.onDecrement}
                testid="minus"
              >
                <BsDashSquare />
              </button>
              <p>{addItem}</p>
              <button
                className="update-button"
                type="button"
                onClick={this.onIncrement}
                testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-cart-button" type="button">
              Add to Cart
            </button>
          </div>
        </div>
        <h1 className="similar-product-heading">Similar Products</h1>
        <div className="similar-container">
          {similarProductItems.map(eachItem => (
            <SimilarProductItem productItem={eachItem} key={eachItem.id} />
          ))}
        </div>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-detail-view-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}
export default ProductItemDetails
