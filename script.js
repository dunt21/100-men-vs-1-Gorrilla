document.getElementById('waitlist-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect form data
  const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      dob: document.getElementById('dob').value // Already in yyyy-mm-dd format (e.g., "2002-04-29")
  };

  try {
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

    const result = await response.json(); // Expecting an array of users
    localStorage.setItem('userSignup', JSON.stringify(result));

    document.getElementById('waitlist-form').classList.remove('show');
    document.getElementById('waitlist-form').classList.add('hide');
    
    document.getElementById('success-message').classList.remove('hidden');
    document.getElementById('success-message').classList.add('show');

    // Update success message with user's data
    document.getElementById('success-name').textContent = formData.name;
    document.getElementById('success-email').textContent = formData.email;

    // Update sign-up count
    updateSignupCount(result.length);
    
} catch (error) {
    console.error('Error submitting form:', error);
    alert('Something went wrong. Please try again.');
}

});

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

    const text = await response.text();
    const data = JSON.parse(text);
    const count = newCount !== null ? newCount : data.length;

    console.log('Parsed GET response data:', data);

    const signupCountElement = document.getElementById('signup-count');
    const milestoneTextElement = document.getElementById('milestone-text');

    const progressFill = document.getElementById('progress-fill');
    const progressIndicator = document.getElementById('progress-indicator');

    const maxSignups = 100;
    const percent = Math.min((count / maxSignups) * 100, 100).toFixed(2);

    // Only these two are updated now
    progressFill.style.width = `${percent}%`;
    progressIndicator.style.left = `calc(${percent}% - 2.5px)`; // center the indicator
    

    signupCountElement.textContent = count || 0;

    if (count >= 100) {
      milestoneTextElement.style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching sign-up count:', error);
    const signupCountElement = document.getElementById('signup-count');
    if (signupCountElement) {
      signupCountElement.textContent = 'Error';
    }
  }
}


// Fetch initial sign-up count on page load
updateSignupCount();

// Periodically update the sign-up count every 10 seconds
setInterval(updateSignupCount, 10000);
