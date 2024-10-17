$(function () {
  var flame = $("#flame");
  var txt = $("h1");

  // Countdown functionality
  var countdown = 3; // 10 seconds countdown
  var countdownInterval = setInterval(function () {
    $("#timer").text("Are you ready? " + countdown);
    countdown--;

    if (countdown < 0) {
      clearInterval(countdownInterval);
      $("#countdown").hide(); // Hide countdown
      $("#cake-section").fadeIn(); // Show cake and candle
      startMicrophone(); // Start microphone to detect blow
    }
  }, 1000);

  // Function to start microphone detection for blowing out candle
  function startMicrophone() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function detectBlow() {
          analyser.getByteTimeDomainData(dataArray);
          let maxVolume = Math.max(...dataArray);

          if (maxVolume > 180) {
            // Detect sound above a certain threshold
            flame.removeClass("burn").addClass("puff");
            $(".smoke").each(function () {
              $(this).addClass("puff-bubble");
            });
            $("#glow").remove();
            txt
              .hide()
              .html("It <b>will</b> come true..")
              .delay(750)
              .fadeIn(300, function () {
                if ($("#continueButton").length === 0) {
                  // Add the button after the message appears
                  $("<button>")
                    .text("Click me if Sagar is an idiot!!!")
                    .attr("id", "continueButton")
                    .appendTo("body")
                    .hide()
                    .fadeIn(800)
                    .on("click", function () {
                      window.location.href = "letter.html"; // Redirect to the next page
                    });
                } // Show the button with a fade-in effect
              });
            $("#candle").animate(
              {
                opacity: ".5",
              },
              100
            );
          } else {
            requestAnimationFrame(detectBlow);
          }
        }
        detectBlow();
      })
      .catch(function (err) {
        console.log("Microphone access denied: ", err);
      });
  }
});
