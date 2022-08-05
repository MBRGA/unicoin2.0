<template>
  <v-app id="inspire">
    <v-container class="pa-6" fluid>
      <v-row>
        <v-col>
          <v-sheet class="pa-4 text-h6">
            <h2>
              We'd love to hear from you. Please reach out with any comments, complaints, compliments, or queries.
            </h2>
            <v-text-field
              label="Full Name"
              v-model="form.FullName"
              :rules="[rules.required, rules.minLength]"
            ></v-text-field>
            <v-text-field
              label="Name of Institution"
              v-model="form.Institution"
              :rules="[rules.required, rules.minLength]"
            ></v-text-field>
            <v-textarea label="Chat to us" outlined v-model="form.textarea"></v-textarea>
            <v-card-actions class="float-right">
              <v-btn color="accent" type="submit" :disabled="sending">submit</v-btn>
            </v-card-actions>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <img class="text-center mt-8" alt="step logo" style="height: 350px" src="../assets/pooUnicorn.gif" />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

interface FormFields {
  FullName?: string;
  Institution?: string;
  Email?: string;
  textarea?: string;
}

const form: FormFields = reactive({
  FullName: undefined,
  Institution: undefined,
  Email: undefined,
  textarea: undefined,
});

const userSaved = ref(false);
const sending = ref(false);
const lastUser = ref<string | undefined>(undefined);

const rules = {
  required: (value: string) => !!value || "Required.",
  minLength: (value: string) => value.length >= 3 || "Invalid value.",
};

</script>

<script>
/*import { mapActions, mapState } from "vuex";
import { validationMixin } from "vuelidate";
import { required, Email, minLength, maxLength } from "vuelidate/lib/validators";
import router from "@/router";
import { min } from "bn.js";

export default {
  name: "TextFields",
  mixins: [validationMixin],
  data: () => ({
    // accountType: "academic",
    /*form: {
      FullName: null,
      Institution: null,
      Email: null,
      textarea: null,
    },
    userSaved: false,
    sending: false,
    lastUser: null,
  }),
  validations: {
    form: {
      FullName: {
        required,
        minLength: minLength(3),
      },
      Email: {
        required,
        minLength: minLength(3),
      },
    },
  },
};*/
</script>

<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
</style>
