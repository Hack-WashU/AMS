<script lang="ts">
import * as Session from "supertokens-web-js/recipe/session";
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            session: false,
            userId: "",
        };
    },
    async mounted (){
        await this.getUserInfo();
        if (!this.session) {
            this.redirectToLogin();
        }
    },
    methods: {
        async getUserInfo() {
            this.session = await Session.doesSessionExist();
            if (this.session) {
                this.userId = await Session.getUserId();
            }
        },
        redirectToLogin() {
            window.location.href = "/auth";
        },
    },
});
</script>

<template>
    <main>
        <h1>Application for User:</h1>
        <p>{{ userId }}</p>
    </main>
</template>