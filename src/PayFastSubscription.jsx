import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from './contexts/AppContexts';

const PayFastSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const { token } = useContext(AppContext);

  const handlePlan = async () => {
    try {
      const res = await axios.get('http://192.168.0.26:5656/Member/api/get-plan');
      setPlans(res.data.data);
    } catch (error) {
      console.log(error);
      setError('Failed to load plans. Please refresh the page.');
    }
  };

  useEffect(() => {
    handlePlan();
  }, []);

  const handleSubscribe = async (planId) => {
    setLoading(true);
    setError(null);
    console.log("planId:", planId);
console.log("token:", token);
    try {
      const res = await axios.post(
        "http://192.168.0.26:5656/Member/payment/create-subscription",
        { planId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
console.log("planId:", planId);
console.log("token:", token);
      const { payfastUrl, payload } = res.data.data;
console.log(res.data.data)
console.log(JSON.stringify(payload, null, 2));

      const form = document.createElement("form");
      form.method = "POST";
      form.action = payfastUrl;

      Object.keys(payload).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = payload[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.log(err.response?.data);
      console.error(err);
      setError(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to make a nice description from features
  const getDescription = (features) => {
    if (features.canUseGallery && features.canAddSocialLinks) {
      return "Unlimited quotations, gallery & social links";
    }
    if (features.quotationsPerMonth === 4) {
      return "Up to 4 quotations per month";
    }
    return `${features.quotationsPerMonth === 0 ? 'Unlimited' : features.quotationsPerMonth} quotations/month`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose Your Plan</h1>
      <p style={styles.subtitle}>Select a subscription plan that works for you</p>

      {error && (
        <div style={styles.errorAlert}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={styles.plansGrid}>
        {plans.map((plan) => (
          <div 
            key={plan._id} 
            style={styles.planCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={styles.planName}>{plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}</h2>
            <p style={styles.planDescription}>{getDescription(plan.features)}</p>
            <div style={styles.priceContainer}>
              <span style={styles.price}>R{plan.price}</span>
              <span style={styles.period}>/month</span>
            </div>

            <button
              onClick={() => handleSubscribe(plan._id)}  // Fixed here
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
        ))}
      </div>

      {plans.length === 0 && !error && (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading plans...</p>
      )}
    </div>
  );
};

// Styles remain exactly the same
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
    marginBottom: '40px',
  },
  errorAlert: {
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    color: '#c33',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  planCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  planName: {
    fontSize: '24px',
    marginBottom: '10px',
    color: '#333',
  },
  planDescription: {
    color: '#666',
    marginBottom: '20px',
    fontSize: '14px',
  },
  priceContainer: {
    marginBottom: '20px',
  },
  price: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#2196F3',
  },
  period: {
    color: '#999',
    marginLeft: '5px',
  },
  button: {
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
  },
};

export default PayFastSubscription;