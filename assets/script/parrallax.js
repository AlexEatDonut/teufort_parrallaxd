jQuery.extend({
  percentage: function (a, b) {
    return Math.round((a / b) * 100);
  },
});

window.addEventListener("load", (event) => {
  let image = document.querySelector("#gifLoading");
  let isLoadedSuccessfully = image.complete && image.naturalWidth !== 0;
  alert("image is loaded successfully");
});

// CHECK IF ON MOBILE

let is_mobile =
  !!navigator.userAgent.match(/iphone|android|blackberry/gi) || false;
if (is_mobile == true) {
  console.log("user is on mobile");
} else {
  console.log("user is on desktop");
}

//DEFINITION VARIABLES

let $layer_0 = $(".layer-0"),
  $layer_1 = $(".layer-1"),
  $layer_2 = $(".layer-2"),
  $layer_3 = $(".layer-3"),
  $x_axis = $("#x-axis"),
  $y_axis = $("#y-axis"),
  $container = $("body"),
  gifLoading = $("#gifLoading"),
  container_w = $container.width(),
  container_h = $container.height(),
  p_left = 0,
  p_top = 0;

let winWidth = $(window).width();
let winHeight = $(window).height();

// let s_pos_x = winWidth / (100 / toPercentage(x, 1));
// let s_pos_y = winHeight / (100 / toPercentage(y, 1));

let s_pos_x = $.percentage(100, winWidth);
let s_pos_y = $.percentage(100, winWidth);

// EVENT ON IMAGE LOADED

// TESTING TO SEE IF THERE IS A GYROSCOPE

if ("LinearAccelerationSensor" in window && "Gyroscope" in window) {
  document.getElementById("moApi").innerHTML = "Generic Sensor API";

  let lastReadingTimestamp;
  let accelerometer = new LinearAccelerationSensor();
  accelerometer.addEventListener("reading", (e) => {
    if (lastReadingTimestamp) {
      intervalHandler(
        Math.round(accelerometer.timestamp - lastReadingTimestamp)
      );
    }
    lastReadingTimestamp = accelerometer.timestamp;
    accelerationHandler(accelerometer, "moAccel");
  });
  accelerometer.start();
  if ("GravitySensor" in window) {
    let gravity = new GravitySensor();
    gravity.addEventListener("reading", (e) =>
      accelerationHandler(gravity, "moAccelGrav")
    );
    gravity.start();
  }

  let gyroscope = new Gyroscope();
  gyroscope.addEventListener("reading", (e) =>
    rotationHandler({
      alpha: gyroscope.x,
      beta: gyroscope.y,
      gamma: gyroscope.z,
    })
  );
  gyroscope.start();
} else if ("DeviceMotionEvent" in window) {
  document.getElementById("moApi").innerHTML = "Device Motion API";
  let onDeviceMotion = function (eventData) {
    // accelerationHandler(eventData.acceleration, "moAccel");
    accelerationHandler(eventData.accelerationIncludingGravity, "moAccelGrav");
    rotationHandler(eventData.rotationRate);
    intervalHandler(eventData.interval);
  };
  window.addEventListener("devicemotion", onDeviceMotion, false);
} else {
  document.querySelector("#moApi").innerHTML =
    "No Accelerometer & Gyroscope API available";
}

// MOUSE MOVEMENT CODE

$(window).on("mousemove.parallax", function (event) {
  let p_pos_x = event.pageX,
    p_pos_y = event.pageY,
    p_left = container_w / 2 - p_pos_x;
  p_top = container_h / 2 - p_pos_y;
  document.querySelector("#pLeftInfo").innerHTML = p_left;
  document.querySelector("#pTopInfo").innerHTML = p_top;
  TweenMax.to($x_axis, 1, {
    css: {
      transform: "translateX(" + p_left * -1 + "px)",
    },
    ease: Expo.easeOut,
    overwrite: "all",
  });
  TweenMax.to($y_axis, 1, {
    css: {
      transform: "translateY(" + p_top * -1 + "px)",
    },
    ease: Expo.easeOut,
    overwrite: "all",
  });

  TweenMax.to($layer_3, 1, {
    css: {
      transform:
        "translateX(" + p_left / 20 + "px) translateY(" + p_top / 10 + "px)",
    },
    ease: Expo.easeOut,
    overwrite: "all",
  });

  TweenMax.to($layer_2, 1, {
    css: {
      transform:
        "translateX(" + p_left / 18 + "px) translateY(" + p_top / 9 + "px)",
    },
    ease: Expo.easeOut,
    overwrite: "all",
  });

  TweenMax.to($layer_1, 1, {
    css: {
      transform:
        "translateX(" + p_left / 16 + "px) translateY(" + p_top / 8 + "px)",
    },
    ease: Expo.easeOut,
    overwrite: "all",
  });

  TweenMax.to($layer_0, 1, {
    css: {
      transform:
        "rotateX(" + p_left / 360 + "deg) rotateY(" + p_top / 360 + ") ;",
      //     transform: "rotate(" + (z_rotation / 10) * -180 + "deg)",
    },
    ease: Expo.easeOut,
    overwrite: "all",
  });
});

// GYROSCOPE CODE

const speed_axis = [-6, -8, -10, -12];

function gyroMovement(target, speed1, speed2, mult1, mult2) {
  TweenMax.to(target, 1, {
    css: {
      transform:
        "translateX(" +
        (x_acceleration * speed1) / mult1 +
        "vw) translateY(" +
        (z_acceleration * -speed2) / mult2 +
        "vh)",
    },
    ease: Expo.easeOut,
    overwrite: "all",
  });
}

function accelerationHandler(acceleration, targetId) {
  let info,
    xyz = "[X, Y, Z]";
  x_acceleration = acceleration.x && acceleration.x.toFixed(2);
  y_acceleration = acceleration.y && acceleration.y.toFixed(2);
  z_acceleration = acceleration.z && acceleration.z.toFixed(2) - 9;

  // info = xyz.replace("X", s_pos.x);
  // info = info.replace("Y", s_pos.y);
  // info = info.replace("Z", z);
  info = xyz.replace("X", x_acceleration);
  info = info.replace("Y", y_acceleration);
  info = info.replace("Z", z_acceleration);
  document.getElementById(targetId).innerHTML = info;
  TweenMax.to($x_axis, 1, {
    css: {
      transform: "translateX(" + x_acceleration * speed_axis[4] + "vw)",
    },
    ease: Expo.easeOut,
    overwrite: "all",
  });
  TweenMax.to($y_axis, 1, {
    css: {
      transform: "translateY(" + z_acceleration * speed_axis[1] + "vh)",
    },
    ease: Expo.easeOut,
    overwrite: "all",
  });
  TweenMax.to($layer_0, 1, {
    css: {
      transform:
        "rotateX(" +
        (x_acceleration * speed_axis[1]) / 360 +
        "deg) rotateY(" +
        (z_acceleration * speed_axis[1]) / 360 +
        "deg);",
    },
    ease: Expo.easeOut,
    overwrite: "all",
  });
  gyroMovement($layer_3, speed_axis[2], speed_axis[1], 4, 2);
  // TweenMax.to($layer_3, 1, {
  //   css: {
  //     transform:
  //       "translateX(" +
  //       (x_acceleration * speed_axis[2]) / 4 +
  //       "vw) translateY(" +
  //       (z_acceleration * -speed_axis[1]) / 2 +
  //       "vh)",
  //   },
  //   ease: Expo.easeOut,
  //   overwrite: "all",
  // });
  gyroMovement($layer_2, speed_axis[2], speed_axis[1], 4, 2);
  // TweenMax.to($layer_2, 1, {
  //   css: {
  //     transform:
  //       "translateX(" +
  //       (x_acceleration * speed_axis[2]) / 6 +
  //       "vw) translateY(" +
  //       (z_acceleration * -speed_axis[1]) / 3 +
  //       "vh)",
  //   },
  //   ease: Expo.easeOut,
  //   overwrite: "all",
  // });
  gyroMovement($layer_1, speed_axis[1], speed_axis[1], 8, 4);
  // TweenMax.to($layer_1, 1, {
  //   css: {
  //     transform:
  //       "translateX(" +
  //       (x_acceleration * speed_axis[1]) / 8 +
  //       "vw) translateY(" +
  //       (z_acceleration * -speed_axis[1]) / 4 +
  //       "vh)",
  //   },
  //   ease: Expo.easeOut,
  //   overwrite: "none",
  // });
}

function rotationHandler(rotation) {
  let info,
    xyz = "[X, Y, Z]";
  x_rotation = rotation.alpha && rotation.alpha.toFixed(2);
  y_rotation = rotation.beta && rotation.beta.toFixed(2);
  z_rotation = rotation.gamma && rotation.gamma.toFixed(2);
  info = xyz.replace("X", y_rotation);
  info = info.replace("Y", x_rotation);
  info = info.replace("Z", z_rotation);
  document.getElementById("moRotation").innerHTML = info;

  // TweenMax.to($layer_1, 1, {
  //   css: {
  //     transform: "rotate(" + (z_rotation / 10) * -180 + "deg)",
  //   },
  //   overwrite: "none",
  // });
}

function intervalHandler(interval) {
  document.querySelector("#moInterval").innerHTML = interval;
}
