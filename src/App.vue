<template>
  <div id="main">
    <div id="canvasArea">
      <canvas id="gameCanvas" ref="game" height="480" width="640"></canvas>
      <p>
        <button v-on:click="move('right')">Right</button>
        <button v-on:click="move('left')">Left</button>
        <button v-on:click="move('up')">Up</button>
        <button v-on:click="move('down')">Down</button>
      </p>
      <p>Location Receives from Server: <b>{{position.x}} {{position.y}}</b></p>
      <input type="text" placeholder="Put Message Here" v-model=sendText>
    </div>
    <div id="textArea">
      <b-card bg-variant="success" text-variant="white" header="Success" class="text-center">
        <b-card-text>{{receivedText}}</b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script>
  import io from 'socket.io-client';
  export default {
    name: 'BlockGame',
    data() {
      return {
        socket: {},
        context: {},
        position: {
          x: 0,
          y: 0,
        },
        receivedText: '',
        sendText:'',
      };
    },
    watch:{
      sendText(){
        this.sendData(this.sendText);
      },
      receivedText(){
        console.log(this.receivedText);
      }
    },
    created() {
      this.socket = io('http://demo-socket-server.herokuapp.com:80');
      // this.socket = io('http://localhost:8080');
      window.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'ArrowUp':
            this.move('up');
            break;
          case 'ArrowDown':
            this.move('down');
            break;
          case 'ArrowLeft':
            this.move('left');
            break;
          case 'ArrowRight':
            this.move('right');
            break;
          default:
            return;
        }
      });
    },
    mounted() {
      this.context = this.$refs.game.getContext('2d');
      this.socket.on('position', (data) => {
        this.position = data;
        this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
        this.context.fillStyle = '#FFFFFF';
        this.context.fillRect(0, 0, this.$refs.game.width, this.$refs.game.width);
        this.context.fillStyle = '#000000';
        this.context.fillRect(this.position.x, this.position.y, 20, 20);
      });
      this.socket.on('textFromServer', (data) =>{
        this.receivedText = data;
      })
    },
    methods: {
      move(direction) {
        this.socket.emit('move', direction);
      },
      sendData(text){
        this.socket.emit('textFromServer', text );
      }
    },
  };
</script>

<style scoped>
  #main {
    display: flex;
    align-items: center;
    justify-content: space-around;
    
  }
  #canvasArea{
    display: inline-block;
  }
  #gameCanvas {
    border: 5px solid black;
  }
</style>
