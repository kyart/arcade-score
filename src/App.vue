<template>

  <div id="app">
    <transition-group tag="ul"
                      appear
                      @before-enter="beforeEnter"
                      @enter="enter"
                      @after-enter="afterEnter"
    >
      <li :class='"list-item"' v-for="(message, index) in this.messages" :key="message.id" :data-index="index">
          <b>{{ message.student_name }}:</b> {{ message.score }}
      </li>
    </transition-group>

  </div>
</template>

<script>
import { gsap } from "gsap"
import { createClient } from "@supabase/supabase-js";
const MAX_MESSAGE_COUNT = 10;

const supabase = createClient(
    "https://ulzdvbvovnplclvvlhap.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsemR2YnZvdm5wbGNsdnZsaGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ5MjUwMzYsImV4cCI6MTk3MDUwMTAzNn0.lYzkQidJKY5sMxOSDw8VsvDrMVml23OO-ssRqpQA5tU"
);

export default {
  name: "App",
  data() {
    return {
      messages: [],
      inputName: "",
      inputScore: "",
    };
  },
  methods: {
    afterEnter(el){
      gsap.to(el, {
        duration: 0.3,
        y: 0,
        opacity: 1,
        delay: el.dataset.index * 0.2,
      })
    },
    async sendMessage() {
      await supabase.from("scoreboard").upsert(
          {
            student_name: this.inputName,
            score: this.inputScore,
            group_id: "1"
          },{
            onConflict: 'student_name'
          }
      );
      this.inputScore = "";
      this.inputName = "";
    },
    async getMessages() {
      const { data } = await supabase
          .from("scoreboard")
          .select("*")
          .limit(MAX_MESSAGE_COUNT)
          .order("score", { ascending: false });
      this.messages = data;
      this.scoreboard = data;

    },
    subscribeUpdateMessage() {
      console.log("subscribe update message")
      supabase
          .from("scoreboard")
          .on("*", ({ new: newMessage }) => {
            const filteredMessages = this.messages.filter((item) => {
              return item.student_name != newMessage.student_name
            });
            filteredMessages.push(newMessage)
            filteredMessages.sort( ( a, b ) => {
              return a.score - b.score;
            })
            filteredMessages.reverse()
            this.messages = filteredMessages
          })
          .subscribe();

    },
    unsubscribeMessage() {
      supabase.removeAllSubscriptions();
    },
  },
  mounted() {
    console.log("mounted")
    this.getMessages()
    //this.subscribeInsertMessage()
    this.subscribeUpdateMessage()
  },
  beforeMount() {
    console.log("before mount")
  },
  beforeUnmount() {
    console.log("before unmount")
    this.unsubscribeMessage()
  },
  updated() {
    console.log("updated")
  },
  beforeUpdate() {
    console.log("before updated")
  },
  watch: {
    messages(newValue) {

      gsap.fromTo(".list-item",
          {y: 10},
          {y: 2, stagger: 0.2});


      console.log(newValue)
    }
  },
  setup() {

    const beforeEnter = (el) => {
      el.style.opacity = 0
      el.style.transform = 'translateY(10px)'
    }

    const enter = (el, done) => {
      gsap.to(el, {
        duration: 0.3,
        y: 0,
        opacity: 1,
        delay: el.dataset.index * 0.2,
        onComplete: done
      })
    }
    return {  beforeEnter, enter }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#app li {
  text-align: left;
  list-style: none;
}
.list-item {

  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
