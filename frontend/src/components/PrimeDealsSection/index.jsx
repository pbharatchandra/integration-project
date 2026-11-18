import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import BeatLoader from 'react-spinners/BeatLoader'

import ProductCard from '../ProductCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const PrimeDealsSection = () => {
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })

  useEffect(() => {
    const getPrimeDeals = async () => {
      // Before the fetch operation, set API status to inProgress
      setApiResponse({
        status: apiStatusConstants.inProgress,
        data: null,
        errorMsg: null,
      })
      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = 'https://apis.ccbp.in/prime-deals'
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }

      const response = await fetch(apiUrl, options)
      const fetchedData = await response.json()
      if (response.ok) {
        const formattedData = fetchedData.prime_deals.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        // Set API status to success and store the formatted data
        setApiResponse(prevApiResponse => ({
          ...prevApiResponse,
          status: apiStatusConstants.success,
          data: formattedData,
        }))
      } else {
        // If response is not successful, set API status to failure and store the error message
        setApiResponse(prevApiResponse => ({
          ...prevApiResponse,
          status: apiStatusConstants.failure,
          errorMsg: fetchedData.error_msg,
        }))
      }
    }

    // Call the async function inside useEffect
    getPrimeDeals()
  }, [])

  const renderPrimeDealsListView = () => {
    const {data} = apiResponse

    return (
      <div>
        <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
        <ul className="products-list">
          {data.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  const renderPrimeDealsFailureView = () => {
    return (
      <img
        src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
        alt="register prime"
        className="register-prime-img"
      />
    )
  }

  const renderLoadingView = () => (
    <div className="primedeals-loader-container">
      <BeatLoader color="#6d1d9c" />
    </div>
  )

  const renderPrimeDeals = () => {
    const {status} = apiResponse
    switch (status) {
      case apiStatusConstants.success:
        return renderPrimeDealsListView()
      case apiStatusConstants.failure:
        return renderPrimeDealsFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  return <>{renderPrimeDeals()}</>
}

export default PrimeDealsSection
