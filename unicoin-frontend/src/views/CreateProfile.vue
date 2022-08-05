<template>
  <v-app>
    <v-container class="px-5">
      <v-row>
        <v-row>
          <v-col>
            <v-sheet class="pa-5">
              <v-card-title> Welcome to Unicoin! </v-card-title>
              <p>
                Create your profile here. Are you a researcher wanting to publish material, or do you represent a
                company wishing to licence a researcher's work?
              </p>
            </v-sheet>
          </v-col>
        </v-row>
      </v-row>
    </v-container>
    <v-radio-group v-model="accountType" row @change="clearForm">
      <v-radio label="Academic" value="academic"></v-radio>
      <v-radio label="Company" value="company"></v-radio>
    </v-radio-group>

    <v-form
      v-if="accountType == AccountType.Academic"
      ref="academicFormRef"
      @submit.prevent="validateAcademic"
      v-model="academicValid"
    >
      <v-card>
        <v-card-title class="text-title">
          To verify your profile as a researcher, please login with ORCID below
        </v-card-title>
        <v-card-text>
          <v-btn
            plain
            href="https://orcid.org/oauth/authorize?client_id=APP-0JZDFYT5L60YYAWM&response_type=token&scope=openid&redirect_uri=http://localhost:8080/CreateProfile"
          >
            <img class="text-right" alt="ORCID logo" style="width: 18px" src="../assets/orcid.png" /> ORCID LOGIN
          </v-btn>
          <v-row>
            <v-col>
              <v-text-field
                label="First Name"
                v-model="academicForm.firstName"
                autocomplete="given-name"
                disabled
                :rules="[rules.required, rules.minLength]"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Last Name"
                v-model="academicForm.lastName"
                autocomplete="family-name"
                disabled
                :rules="[rules.required, rules.minLength]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                label="University"
                v-model="academicForm.university"
                autocomplete="university"
                :rules="[rules.required, rules.minLength]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                label="Email"
                v-model="academicForm.email"
                autocomplete="email"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-progress-linear :indeterminate="sending" :active="sending"></v-progress-linear>
          <v-btn type="submit" @click="createUser">Create User</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-form
      v-else-if="accountType == AccountType.Company"
      ref="companyFormRef"
      @submit.prevent="validateCompany"
      v-model="companyValid"
    >
      <v-card>
        <v-card-title class="text-title">
          To verify your profile as an institution, please provide your company details below.
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                label="Company"
                v-model="companyForm.companyName"
                autocomplete="company"
                disabled
                :rules="[rules.required, rules.minLength]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                label="Email"
                v-model="companyForm.email"
                autocomplete="email"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-progress-linear :indeterminate="sending" :active="sending"></v-progress-linear>
          <v-btn type="submit" @click="createUser">Create User</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-snackbar v-model="userSaved">The user {{ lastUser }} was successfully saved!</v-snackbar>
    <v-dialog v-model="newUser">
      <v-card>
        <v-card-title>Create an account</v-card-title>
        <v-card-text>
          <p class="pa-6">
            To use the Unicorn platform you first need to create an account. This will add your information to the
            blockchain and be used to verify your identity when you add new publications or place bids on research. As
            an academic you will require an OrcidID to make your account. A company needs a name an an email address.
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import MiningTransaction from "@/components/widgets/MiningTransaction.vue";
import { computed, onMounted, reactive, ref } from "vue";
import { useStore } from "@/store/piniastore";
import { useRouter, useRoute } from "vue2-helpers/vue-router";
//import { useRouter, useRoute } from "vue-router";
//import useRouter from "vue-router";

import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { isContext } from "vm";
import { VForm } from "vuetify/lib/components";
import Vue from "vue";
import { AcademicProfile, CompanyProfile } from "@/utils/ipfsUploader";

const store = useStore();

const academicForm = reactive({
  firstName: "",
  lastName: "",
  email: "",
  orcid: "",
  university: "",
  timestamp: new Date(),
});

const companyForm = reactive({
  companyName: "",
  email: "",
  timestamp: new Date(),
});

const rules = {
  required: (value: string) => !!value || "Required.",
  minLength: (value: string) => value.length >= 3 || "Invalid value.",
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Invalid email.";
  },
};

enum AccountType {
  Academic,
  Company,
}

const newUser = ref(false);
const accountType = ref(AccountType.Academic);
const userSaved = ref(false);
const sending = ref(false);
const lastUser = ref("");

const router = useRouter();

const route = useRoute();

// We have to manually make sure these refs are typed with the validate function included
const academicFormRef = ref<(Vue & { validate: () => boolean }) | null>(null);
const companyFormRef = ref<(Vue & { validate: () => boolean }) | null>(null);

const companyValid = ref(false);
const academicValid = ref(false);

const canCreateUser = computed(() => {
  return (accountType.value == AccountType.Academic && academicValid.value) || companyValid.value;
});

function validateAcademic() {
  academicFormRef.value?.validate();
}

function validateCompany() {
  companyFormRef.value?.validate();
}

function createUser() {
  if (canCreateUser.value) {
    console.log("Create User method");

    let submitBlob =
      accountType.value == AccountType.Academic ? (academicForm as AcademicProfile) : (companyForm as CompanyProfile);
    submitBlob.timestamp = new Date();
    console.log("user create blob");
    store.createUser(submitBlob);
  }
}

onMounted(async () => {
  const token = route?.hash;
  if (token) {
    const openid_resp = new URLSearchParams(token);
    const id_token = openid_resp.get("id_token");

    if (id_token) {
      jwt.verify(
        id_token,
        (header, callback) => {
          const client = jwksClient({ jwksUri: "https://sandbox.orcid.org/oauth/jwks" });
          client.getSigningKey(header.kid, (err, key) => {
            callback(null, key?.getPublicKey());
          });
        },
        (err, decoded) => {
          if (err) {
            console.error(err);
            return;
          }

          if (!decoded) {
            console.error("Missing ORCID OpenID response");
            return;
          }

          if (typeof decoded === "string") {
            console.error("Unable to parse ORCID OpenID response");
            return;
          }

          const dec_payload = decoded as jwt.JwtPayload;

          if (!dec_payload.sub) {
            console.error("Invalid ORCID OpenID response - missing 'sub' field");
            return;
          }

          academicForm.firstName = dec_payload.given_name;
          academicForm.lastName = dec_payload.family_name;
          academicForm.orcid = dec_payload.sub;
        }
      );
    }
  }
});
</script>

<script>
//import MiningTransaction from "@/components/widgets/MiningTransaction";

/*import { mapActions, mapState } from "vuex";
import { validationMixin } from "vuelidate";
import { required, email, minLength, maxLength } from "vuelidate/lib/validators";
import router from "@/router";
import { min } from "bn.js";
var jwt = require("jsonwebtoken");
export default {
  name: "FormValidation",
  components: { MiningTransaction },
  mixins: [validationMixin],
  data: () => ({
    newUser: false,
    accountType: "academic",
    academicForm: {
      firstName: "",
      lastName: "",
      email: "",
      orcid: "",
      university: "",
    },
    companyForm: {
      name: "",
      email: "",
    },
    userSaved: false,
    sending: false,
    lastUser: "",
  }),
  validations: {
    academicForm: {
      firstName: {
        required,
        minLength: minLength(3),
      },
      lastName: {
        required,
        minLength: minLength(3),
      },
      university: {
        required,
        minLength: minLength(3),
      },
      email: {
        required,
        minLength: minLength(3),
      },
    },
    companyForm: {
      name: {
        required,
        minLength: minLength(3),
      },
      email: {
        required,
        minLength: minLength(3),
      },
    },
  },
  mounted() {
    console.log("CreateProfile Mounted");
    console.log(this.$route);
    let token = this.getFragmentParameterByName("id_token", this.$route.hash);
    if (token) {
      let decoded = jwt.decode(token);
      console.log("decoded");
      console.log(decoded);
      this.academicForm.firstName = decoded.given_name;
      this.academicForm.lastName = decoded.family_name;
      this.academicForm.orcid = decoded.sub;
    }

    if (this.$route.query.newUser == "true") {
      console.log("onboarding new user");
      this.newUser = true;
    }
  },
  methods: {
    ...mapActions(["CREATE_USER"]),
    createUser() {
      console.log("user button clicked");
      if (this.canCreateUser) {
        console.log("Create User method");
        let submitBlob = this.accountType == "academic" ? this.academicForm : this.companyForm;
        submitBlob["timestamp"] = new Date();
        submitBlob["accountType"] = this.accountType;
        console.log("user create blob");
        this.CREATE_USER(submitBlob);
      }
    },
    getFragmentParameterByName(name, route) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\#&]" + name + "=([^&#]*)"),
        results = regex.exec(route);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    getAcademicValidationClass(fieldName) {
      const field = this.$v.academicForm[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    getCompanyValidationClass(fieldName) {
      const field = this.$v.companyForm[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.academicForm.firstName = "";
      this.academicForm.lastName = "";
      this.academicForm.university = "";
      this.academicForm.email = "";
      this.companyForm.name = "";
      this.companyForm.email = "";
    },
  },
  computed: {
    canCreateUser() {
      if (this.accountType == "academic") {
        if (
          this.academicForm.firstName != "" &&
          this.academicForm.lastName != "" &&
          this.academicForm.university != "" &&
          this.academicForm.email != "" &&
          this.academicForm.orcid != ""
        ) {
          return true;
        }
      }

      if (this.accountType == "company") {
        if (this.companyForm.email != "" && this.companyForm.name != "") {
          return true;
        }
      }
      console.log("values not added correctly");
      return false;
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
