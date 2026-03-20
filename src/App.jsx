import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'
import TransactionHistory from './TransactionHistory'
import PaymentModal from './PaymentModal'
import { CoinIcon } from './CoinIcon'
import './App.css'

const coinPackages = [
  { coins: 30, price: 0.29 },
  { coins: 350, price: 3.49 },
  { coins: 700, price: 6.99 },
  { coins: 1400, price: 13.99 },
  { coins: 3500, price: 34.99 },
  { coins: 7000, price: 69.99 },
  { coins: 17500, price: 174.99 },
]

const LOGO_IMAGE = 'https://icon2.cleanpng.com/20200922/xqh/transparent-social-media-1713858561643.webp'

function App() {
  const [tiktokId, setTiktokId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)
  const [currentUser, setCurrentUser] = useState({
    name: 'memorymusic',
    id: 'memorymusic',
    balance: 2403,
    avatar: 'https://i.pravatar.cc/150?u=memorymusic'
  })
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastTransaction, setLastTransaction] = useState(null)
  const [customCoins, setCustomCoins] = useState('')
  const [customPrice, setCustomPrice] = useState('')

  // Debounced search logic as requested: "Khi tôi nhập tên người dùng sẽ load 1 lúc"
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tiktokId && tiktokId.length > 2 && searchResults.length === 0 && !isSearching) {
        handleSearch()
      }
    }, 800) // Start search after 800ms of no typing
    
    return () => clearTimeout(timer)
  }, [tiktokId])

  // Click away listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRecharge = () => {
    if (!tiktokId || !selectedPackage) {
      alert('Please enter TikTok ID and select a coin package')
      return
    }
    setShowPayment(true)
  }

  const handleSearch = () => {
    if (!tiktokId) return
    
    setIsSearching(true)
    setSearchResults([])
    setShowDropdown(true)
    
    // Simulate 3-4 second loading as requested
    setTimeout(() => {
      setIsSearching(false)
      const baseId = tiktokId.split('@').pop()
      const users = [
        {
          name: baseId,
          id: tiktokId,
          avatar: `https://i.pravatar.cc/150?u=${tiktokId}`,
          balance: Math.floor(Math.random() * 5000)
        },
        {
          name: `${baseId}_official`,
          id: `${tiktokId}_official`,
          avatar: `https://i.pravatar.cc/150?u=${tiktokId}1`,
          balance: Math.floor(Math.random() * 5000)
        },
        {
          name: `${baseId}_fan`,
          id: `${tiktokId}_fan`,
          avatar: `https://i.pravatar.cc/150?u=${tiktokId}2`,
          balance: Math.floor(Math.random() * 5000)
        },
        {
          name: `real_${baseId}`,
          id: `real_${tiktokId}`,
          avatar: `https://i.pravatar.cc/150?u=${tiktokId}3`,
          balance: Math.floor(Math.random() * 5000)
        }
      ]
      setSearchResults(users)
    }, 3500)
  }

  const handleSelectUser = (user) => {
    setCurrentUser(user)
    setSearchResults([])
    setShowDropdown(false)
  }

  const handlePaymentSuccess = async () => {
    try {
      const transactionData = {
        tiktok_id: tiktokId,
        coin_amount: selectedPackage.coins,
        price: selectedPackage.price,
        payment_method: 'VISA',
        status: 'completed'
      }

      const { data, error } = await supabase
        .from('recharge_history')
        .insert([transactionData])
        .select()
        .single()

      if (error) throw error

      setLastTransaction(data)
      setShowPayment(false)
      setShowSuccess(true)
      setTiktokId('')
      setSelectedPackage(null)
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert('An error occurred while saving the transaction')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <img src={LOGO_IMAGE} alt="TikTok" className="logo-icon" />
          <span>TikTok</span>
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search"
          />
        </div>
        <div className="header-actions">
          <button className="upload-btn">
            <span>+</span> Upload
          </button>
        </div>
      </header>

      <div className="container">
        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">Get Coins</h1>
            <button
              className="history-link"
              onClick={(e) => {
                e.preventDefault()
                setShowHistory(true)
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View transaction history
            </button>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {currentUser.avatar ? <img src={currentUser.avatar} alt="avatar" /> : currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="username">{currentUser.name}</div>
              <div className="user-balance">
                <CoinIcon size="20px" />
                <span>{currentUser.balance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="input-section">
            <label className="input-label">TikTok ID to Recharge</label>
            <div className="search-container-input" ref={searchRef}>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="tiktok-id-input"
                  placeholder="Enter your TikTok ID"
                  value={tiktokId}
                  onChange={(e) => {
                    setTiktokId(e.target.value)
                    setSearchResults([]) // Reset results when typing
                    setShowDropdown(true)
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  onFocus={() => tiktokId.length > 2 && setShowDropdown(true)}
                />

                {showDropdown && (tiktokId.length > 2) && (
                  <div className="search-dropdown">
                    {isSearching ? (
                      <div className="dropdown-loading">
                        <div className="spinner"></div>
                        <span>Searching for "@{tiktokId}"...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="dropdown-item"
                          onClick={() => handleSelectUser(user)}
                        >
                          <div className="dropdown-avatar">
                            <img src={user.avatar} alt={user.name} />
                          </div>
                          <div className="dropdown-info">
                            <div className="dropdown-name">{user.name}</div>
                            <div className="dropdown-id">@{user.id}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-loading">
                        <span>No results found for "@{tiktokId}"</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={isSearching || !tiktokId}
              >
                Search
              </button>
            </div>
          </div>

          <div className="recharge-notice">
            <div className="notice-title">Recharge:</div>
            <div className="notice-text">Save about 25% with lower third-party service fees.</div>
          </div>

          <div className="coin-packages">
            {coinPackages.map((pkg, index) => (
              <div
                key={index}
                className={`coin-package ${selectedPackage?.coins === pkg.coins ? 'selected' : ''}`}
                onClick={() => setSelectedPackage(pkg)}
              >
                <div className="coin-amount">
                  <CoinIcon size="40px" />
                  <span>{pkg.coins.toLocaleString()}</span>
                </div>
                <div className="coin-price">${pkg.price.toLocaleString()}</div>
              </div>
            ))}
            <div
              className={`coin-package custom-package ${selectedPackage?.isCustom ? 'selected' : ''}`}
            >
              <div className="custom-input-wrapper">
                <CoinIcon size="40px" />
                <input
                  type="text"
                  inputMode="numeric"
                  className="custom-coin-input"
                  placeholder=""
                  value={customCoins}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')

                    if (value.length > 7) {
                      return
                    }

                    setCustomCoins(value)

                    if (value) {
                      const numValue = parseInt(value)
                      if (numValue >= 30 && numValue <= 2500000) {
                        const calculatedPrice = (numValue * 0.01).toFixed(2)
                        setCustomPrice(calculatedPrice)
                        setSelectedPackage({ coins: numValue, price: parseFloat(calculatedPrice), isCustom: true })
                      } else if (numValue > 2500000) {
                        setCustomCoins('2500000')
                        const calculatedPrice = (2500000 * 0.01).toFixed(2)
                        setCustomPrice(calculatedPrice)
                        setSelectedPackage({ coins: 2500000, price: parseFloat(calculatedPrice), isCustom: true })
                      } else {
                        setCustomPrice('')
                        if (selectedPackage?.isCustom) {
                          setSelectedPackage(null)
                        }
                      }
                    } else {
                      setCustomPrice('')
                      if (selectedPackage?.isCustom) {
                        setSelectedPackage(null)
                      }
                    }
                  }}
                />
              </div>
              <div className="coin-price">
                {customPrice ? `$${parseFloat(customPrice).toLocaleString()}` : '30-2,500,000'}
              </div>
            </div>
          </div>

          <div className="promo-section">
            <div className="promo-icon">🎁</div>
            <div className="promo-content">
              <div className="promo-text">
                Recharge to unlock 5% cashback up to USD250 for your next Coin purchase
              </div>
              <div className="promo-subtext">
                Default invite code has been applied. Change code ✏️
              </div>
            </div>
          </div>

          <div className="payment-section">
            <div className="section-label">Payment Methods</div>
            <div className="payment-methods">
              <img src="/visa.png" alt="VISA" className="payment-method-img" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="payment-method-img" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg" alt="JCB" className="payment-method-img" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="AMEX" className="payment-method-img" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg" alt="Union Pay" className="payment-method-img" />
            </div>
          </div>

          <div className="total-section">
            <div className="total-label">Total</div>
            <div className="total-amount">
              ${selectedPackage ? selectedPackage.price.toLocaleString() : '0'}
            </div>
          </div>

          <button
            className="recharge-btn"
            onClick={handleRecharge}
            disabled={!tiktokId || !selectedPackage}
          >
            Recharge
          </button>

          <div className="security-badge">
            <div className="secure-icon">🔒 SECURE</div>
            <span>Safe and secure payment</span>
          </div>
        </div>
      </div>

      {showHistory && (
        <TransactionHistory onClose={() => setShowHistory(false)} />
      )}

      {showPayment && (
        <PaymentModal
          tiktokId={tiktokId}
          selectedPackage={selectedPackage}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {showSuccess && lastTransaction && (
        <div className="modal-overlay" onClick={() => setShowSuccess(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="success-modal">
              <div className="success-icon">✓</div>
              <h2 className="success-title">Payment Successful!</h2>
              <p className="success-message">Your coins have been added successfully</p>

              <div className="success-details">
                <div className="success-row">
                  <span>TikTok ID:</span>
                  <strong>{lastTransaction.tiktok_id}</strong>
                </div>
                <div className="success-row">
                  <span>Coins:</span>
                  <strong>
                    <CoinIcon size="16px" style={{ marginRight: '4px' }} />
                    {lastTransaction.coin_amount.toLocaleString()}
                  </strong>
                </div>
                <div className="success-row">
                  <span>Amount:</span>
                  <strong>${lastTransaction.price.toLocaleString()}</strong>
                </div>
              </div>

              <button className="close-success-btn" onClick={() => setShowSuccess(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
