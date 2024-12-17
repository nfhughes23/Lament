// When the window finishes loading, execute the following function
window.onload = function () {

  // ANIMATE TEXT

  // Select the title text element
  const titleText = document.getElementById("title-text");

  // Initial and final text values
  const initialText = "Lament for a Dying Planet";
  const finalText = "Lament.Earth";

  // Set the initial text (optional if already set in HTML)
  titleText.textContent = initialText;

  // Delay before starting the text animation (in seconds)
  const delayBeforeTextAnimation = 2; // Adjust as needed

  // Function to animate the text change
  function animateTextChange() {
    // Animate the deletion of "for a Dying Planet"
    gsap.to(titleText, {
      duration: 2, // Duration of the deletion animation
      text: "Lament", // Text to change to during deletion
      ease: "none",
      onComplete: function () {
        // After deleting, animate typing ".Earth"
        gsap.to(titleText, {
          duration: 2, // Duration of the typing animation
          text: finalText, // Final text
          ease: "none",
        });
      },
    });
  }
  // Start the text animation after a delay
  gsap.delayedCall(delayBeforeTextAnimation, animateTextChange);

  // GALLERY ANIMATION

  // Select the gallery container element
  const gallery = document.querySelector(".gallery");

  // Add an event listener for mouse movement over the document
  document.addEventListener("mousemove", function (event) {
    // Get the mouse cursor's X and Y positions
    const x = event.clientX;
    const y = event.clientY;

    // Calculate the center coordinates of the window
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate the percentage distance from the center
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    // Adjust rotation angles based on mouse position
    const rotateX = 55 + percentY * 1.5; // Rotate around X-axis
    const rotateY = percentX * 1.5;      // Rotate around Y-axis

    // Use GSAP to animate the gallery's rotation
    gsap.to(gallery, {
      duration: 1,            // Animation duration
      ease: "power2.out",     // Easing function
      rotateX: rotateX,       // Set X-axis rotation
      rotateY: rotateY,       // Set Y-axis rotation
      overwrite: "auto",      // Overwrite previous animations
    });
  });

  // Loop to create 78 gallery items dynamically
  for (let i = 0; i < 78; i++) {
    // Create a new div element for each item
    const item = document.createElement("div");
    item.className = "item"; // Assign the 'item' class to the div
    // Create an image element
    const img = document.createElement("img");
    // Set the image source to the same image for all items
    img.src = "./assets/img1.jpg";
    // Append the image to the item div
    item.appendChild(img);
    // Append the item to the gallery container
    gallery.appendChild(item);
  }

  // Select all item elements
  const items = document.querySelectorAll(".item");
  const numberOfItems = items.length;           // Total number of items
  const angleIncrement = 360 / numberOfItems;   // Angle between each item

  // Set initial rotation for items
  items.forEach((item, index) => {
    gsap.set(item, {
      rotationY: 90,                          // Rotate 90 degrees around Y-axis
      rotationZ: index * angleIncrement - 90, // Distribute items in a circle
      transformOrigin: "50% 400px",           // Set pivot point for rotations
    });
  });

  // TRACK MOUSE POSITION FOR DIRECTION-BASED HOVER
  let currentMouseX = window.innerWidth / 2; // Default to center
  document.addEventListener("mousemove", (e) => {
    currentMouseX = e.clientX;
  });

  // Adjust the hover effect based on mouse position relative to screen center
  items.forEach((item) => {
    item.addEventListener("mouseover", function () {
      const centerX = window.innerWidth / 2;
      const directionOffset = currentMouseX < centerX ? -20 : 20;

      gsap.to(item, {
        x: directionOffset,
        y: 10,
        z: 10,
        ease: "power2.out",
        duration: 0.5,
      });
    });

    item.addEventListener("mouseout", function () {
      gsap.to(item, {
        x: 0,
        y: 0,
        z: 0,
        ease: "power2.out",
        duration: 0.5,
      });
    });
  });

  // Create a ScrollTrigger instance to animate items on scroll
  ScrollTrigger.create({
    trigger: "body",           // Element that triggers the scroll effect
    start: "top top",          // Start when the top of the trigger hits the top of the viewport
    end: "bottom bottom",      // End when the bottom of the trigger hits the bottom of the viewport
    scrub: 2,                  // Smooth scrubbing animation over 2 seconds
    onRefresh: setupRotation,  // Function to call when ScrollTrigger refreshes
    onUpdate: (self) => {
      // Calculate rotation progress based on scroll position
      const rotationProgress = self.progress * 360 * 1;

      // Update each item's rotation around Z-axis
      items.forEach((item, index) => {
        const currentAngle = index * angleIncrement - 90 + rotationProgress;
        gsap.to(item, {
          rotationZ: currentAngle,     // Set new rotation angle
          duration: 1,                 // Animation duration
          ease: "power3.out",          // Easing function
          overwrite: "auto",           // Overwrite previous animations
        });
      });
    },
  });


// ScrollTrigger for rotation and pop-out logic
ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "bottom bottom",
  scrub: 2,
  onRefresh: setupRotation,
  onUpdate: (self) => {
    const rotationProgress = self.progress * 360;

    // Update each item's rotation around Z-axis
    items.forEach((item, index) => {
      const currentAngle = index * angleIncrement - 90 + rotationProgress;
      gsap.to(item, {
        rotationZ: currentAngle,
        duration: 1,
        ease: "power3.out",
        overwrite: "auto",
      });
    });

    // Identify the item closest to the far-left position
    let closestItem = null;
    let closestDistance = Infinity;

    items.forEach((item, index) => {
      const currentAngle = index * angleIncrement - 90 + rotationProgress;
      let normalizedAngle = currentAngle % 360;

      // Use ±270° for normalization as discussed
      if (normalizedAngle > 270) normalizedAngle -= 360;
      if (normalizedAngle < -270) normalizedAngle += 360;

      const distanceToLeft = Math.abs(normalizedAngle + 180);
      if (distanceToLeft < closestDistance) {
        closestDistance = distanceToLeft;
        closestItem = item;
      }
    });

    // Pop out the closest item
    items.forEach((item) => {
      gsap.to(item, {
        x: (item === closestItem) ? -30 : 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  },
});

function setupRotation() {}

  // Empty function for ScrollTrigger's onRefresh callback
  function setupRotation() {}

  
  // MODAL ANIMATION FUNCTIONALITY

  // Get the modal elements
  const modal = document.querySelector(".img-modal");
  const modalNav = document.querySelector(".modal-nav");
  const imgViewContainer = document.querySelector(".img-modal .img-view");
  const closeBtn = document.querySelector(".close-btn");
  const modalName = document.querySelector(".modal-name");
  const modalNameRevealer = document.querySelector(".modal-name-revealer");

  // Create a GSAP timeline and pause it initially
  const tl = gsap.timeline({ paused: true });

  // JSON Data for Randomization
  let cardData = [];
  async function loadCardData() {
    try {
      const response = await fetch('./cards.json');
      cardData = await response.json();
    } catch (error) {
      console.error('Error loading card data:', error);
    }
  }
  loadCardData();

  // Select all images inside the gallery items
  const galleryImages = document.querySelectorAll(".item img");

  // Loop through the images and add event listeners
  galleryImages.forEach(function (image) {
    image.addEventListener("click", function () {
      if (cardData.length === 0) {
        console.error("Card data not loaded yet!");
        return;
      }

      // Select a random card from the card data
      const randomCard = cardData[Math.floor(Math.random() * cardData.length)];

      // Update modal content with random card details
      imgViewContainer.innerHTML = `<img src="${randomCard.imageURL}" alt="Modal Image">`;
      modalName.textContent = randomCard.title;

      // Play the opening animation of the modal
      tl.reversed(false);
    });
  });

  // Add a click event listener to the close button to close the modal
  closeBtn.addEventListener("click", function () {
    // Play the closing animation of the modal
    tl.reversed(true);
  });

  // Define a function to create the reveal animations using GSAP
  function revealModalItems() {
    // Animate the modal to become visible
    tl.to(modal, { opacity: 1, pointerEvents: 'auto', duration: 2 });

    // Animate the image reveal in the modal
    tl.to(
      ".img-view",
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        y: 0,
        duration: 3,
        ease: "power4.inOut",
      },
      "<"
    );

    // Animate the close button to move into view
    tl.to(
      ".close-btn .btn",
      {
        top: "0",
        duration: 1,
        ease: "power4.inOut",
      },
      "<"
    );

    // Animate the modal name (caption) to move into view
    tl.to(
      ".modal-name",
      {
        top: "0",
        duration: 1,
        ease: "power4.inOut",
      },
      "<"
    )
      .reverse();
  }

  // Call the function to set up the animations
  revealModalItems();

};