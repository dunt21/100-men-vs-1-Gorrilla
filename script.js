document.addEventListener('DOMContentLoaded', () => {

  const storedData = localStorage.getItem('userSignup');
  
  if (storedData) {
    try {
      const userData = JSON.parse(storedData);
      showSuccessMessage(userData);
      updateSignupCount(userData.length || 0);
    } catch (e) {
      console.error('Error parsing stored data:', e);
      showForm();
    }
  } else {
    showForm();
  }

 
  updateSignupCount();
  setInterval(updateSignupCount, 10000);
});


document.getElementById('waitlist-form').addEventListener('submit', async (e) => {
  e.preventDefault();

 
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    dob: document.getElementById('dob').value
  };

  const dob = new Date(formData.dob);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  
  if (age < 18) {
    alert('You must be at least 18 years old to participate in this challenge.');
    return; // Stop form submission
  }

  try {
    
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    
    const response = await fetch('https://mysite-xq4z.onrender.com/waitlist/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    
   
    const existingData = JSON.parse(localStorage.getItem('userSignup')) || [];
    const updatedData = [...existingData, ...(Array.isArray(result) ? result : [result])];
    localStorage.setItem('userSignup', JSON.stringify(updatedData));

   
    showSuccessMessage(updatedData);
    updateSignupCount(updatedData.length);
    
  } catch (error) {
    console.error('Error submitting form:', error);
    alert(error.message || 'Something went wrong. Please try again.');
  } finally {
    // Reset button state
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join the Battle!';
    }
  }
});


function showSuccessMessage(userData) {

  document.getElementById('waitlist-form').classList.remove('show');
  document.getElementById('waitlist-form').classList.add('hide');
  
 
  const successMessage = document.getElementById('success-message');
  successMessage.classList.remove('hidden');
  successMessage.classList.add('show');

  // Get the most recent user from stored data
  const lastUser = userData[userData.length - 1] || {};

  document.getElementById('success-name').textContent = lastUser.name || 'Participant';
  document.getElementById('success-email').textContent = lastUser.email || '';
}

function showForm() {
  document.getElementById('waitlist-form').classList.add('show');
  document.getElementById('waitlist-form').classList.remove('hide');
  document.getElementById('success-message').classList.add('hidden');
  document.getElementById('success-message').classList.remove('show');
}


async function updateSignupCount(newCount = null) {
  try {
    const response = await fetch('https://mysite-xq4z.onrender.com/waitlist/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const storedData = JSON.parse(localStorage.getItem('userSignup')) || [];
    const count = newCount !== null ? newCount : (data.length || storedData.length);


    const maxSignups = 100;
    const percent = Math.min((count / maxSignups) * 100, 100).toFixed(2);
    document.getElementById('progress-fill').style.width = `${percent}%`;
    document.getElementById('progress-indicator').style.left = `calc(${percent}% - 2.5px)`;
    

    document.getElementById('signup-count').textContent = count;


    if (count >= 100 && document.getElementById('milestone-text')) {
      document.getElementById('milestone-text').style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching sign-up count:', error);
    document.getElementById('signup-count').textContent = 'Error';
  }
}