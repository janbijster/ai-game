<template>
  <div id="app">
    <router-view/>

  </div>
</template>

<style>
@import 'assets/css/colors.css';
@import 'assets/css/typo.css';
@font-face {
  font-family: "PressStart2P-Regular";
  src: url("assets/fonts/PressStart2P-Regular.ttf") format("truetype");
}

body {
  overflow: hidden;
  text-align: center;
}
#app {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

#nav {
  position: absolute;
  bottom: 10px;
}

.left-part {
  position: absolute;
  left: 30px;
  right: calc(50% + 15px);
  top: 0;
  bottom: 0;
}
.right-part {
  position: absolute;
  left: calc(50% + 15px);
  right: 30px;
  top: 0;
  bottom: 0;
}

.fill-parent-absolute {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.vertical-center {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.vertical-center {
  margin-top:auto;
  margin-bottom: auto;
}

</style>
