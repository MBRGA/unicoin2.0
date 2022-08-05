<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row class="pt-16">
          <v-spacer />
          <v-col cols="5">
            <span class="text-h2">Unlock the value in academic research</span>
            <p class="pt-4">
              <br />Introducing a new research marketplace to empower academics to benefit from commercially viable
              work. <br />Connecting researchers and companies since 2019.
              <br />
              <br />
              <router-link to="/CreateProfile" v-slot="{ href, navigate }">
                <v-btn color="primary" :href="href" @click="navigate">Begin</v-btn>
              </router-link>
              <v-btn href="https://github.com/unicornlicences/unicoindapp">Learn More</v-btn>
              <router-link to="/ContactUs" v-slot="{ href, navigate }">
                <v-btn :href="href" @click="navigate">GET IN TOUCH</v-btn>
              </router-link>
            </p>
          </v-col>
          <v-col cols="5">
            <img class="text-center" alt="step logo" style="width: 100%" src="../assets/unicorn_running.gif" />
          </v-col>
          <v-spacer />
        </v-row>

        <v-sheet>
          <v-row>
            <v-spacer />
            <v-col cols="4">
              <img class="text-center" alt="step logo" style="height: 85px" src="../assets/003-search.png" />
              <p class="text-center">
                Researchers can share their work for free download for non-commercial purposes. They can licence it to
                companies who want to implement their work commercially.
              </p>
            </v-col>
            <v-col cols="4">
              <img class="text-center" alt="step logo" style="height: 85px" src="../assets/001-statistics.png" />
              <p class="text-center">
                Researchers have the flexibility to choose how and when to licence their work – putting the power of
                their IP truly in their hands.
              </p>
            </v-col>
            <v-spacer />
          </v-row>
          <v-row>
            <v-spacer />
            <v-col cols="4">
              <img class="text-center" alt="step logo" style="height: 85px" src="../assets/002-wallet.png" />
              <p class="text-center">
                Companies wanting to fund research or purchase rights to intellectual property now have one easily
                accessible marketplace.
              </p>
            </v-col>
            <v-col cols="4">
              <img class="text-center" alt="step logo" style="height: 85px" src="../assets/005-test-tube.png" />
              <p class="text-center">
                Companies can access world-class research and only licence it if it totally suits their intended
                use-case. The open research movement prevails, while ensuring research is justly acknowledged.
              </p>
            </v-col>
            <v-spacer />
          </v-row>
        </v-sheet>

        <v-row>
          <v-col class="text-h4 text-center pt-12">How does <span class="font-weight-bold">Unicoin</span> Work?</v-col>
        </v-row>
        <v-row>
          <v-col class="py-12 my-12">
            <v-timeline>
              <v-timeline-item small>
                <div>
                  <h3>Step 1</h3>
                  <div>
                    Researchers register on the platform, with their identities attested to by ORCID, a digital
                    identifier for academics
                  </div>
                </div>
              </v-timeline-item>
              <v-timeline-item small>
                <div>
                  <h3>Step 2</h3>
                  <div>
                    Research is uploaded to the platform, available freely for download, with a
                    <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
                      >Creative Commons Attribution-NonCommercial-NoDerivatives 4.0</a
                    >
                  </div>
                </div>
              </v-timeline-item>
              <v-timeline-item small>
                <div>
                  <h3>Step 3</h3>
                  <div>
                    Entities wishing to use any research for commercial purposes can browse the platform and purchase a
                    <a href="https://creativecommons.org/licenses/by/4.0/"
                      >Creative Commons Attribution 4.0 International</a
                    >
                    licence, giving them permission to utilize the research for commercial purposes
                  </div>
                </div>
              </v-timeline-item>
              <v-timeline-item small>
                <div>
                  <h3>Step 4</h3>
                  <div>
                    Funds securely transferred to researchers through an Ethereum smart contract can be automatically
                    distrubuted to influential works of research, ensuring foundational research is recognized and
                    compensated
                  </div>
                </div>
              </v-timeline-item>
              <v-timeline-item small>
                <div>
                  <h3>Step 5</h3>
                  <div>
                    Researchers can use UniCoin as a platform for funding their research! Institutions wanting to
                    allocate funds towards specific research topics can use UniCoin to fund research in advance,
                    ensuring that all the right parties receive an allocation of that funding as well
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-col>
        </v-row>

        <v-sheet>
          <v-row>
            <v-col class="text-h3 text-center">
              The <span class="font-weight-bold">technology</span> behind UniCoin
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card>
                <v-img src="../assets/ethereum.png" alt="ethereum logo" class="text-center pt-5" height="200px" />
                <v-card-title> Ethereum Smart Contracts </v-card-title>
                <v-card-subtitle>
                  Immutable fund processing and issuing of non-fungible token licences.
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn icon @click="expanders.ethereum = !expanders.ethereum">
                    <v-icon>{{ expanders.ethereum ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
                  </v-btn>
                </v-card-actions>
                <v-expand-transition>
                  <div v-show="expanders.ethereum">
                    <v-card-text>
                      Through our smart contract, written in Solidity and tested in JavaScript using Truffle, we issue
                      licences to commercial rights through the issuance of an NFT. Licences are cryptographically
                      unique and only allow the buyer to those commercial rights.
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-col>
            <v-col>
              <v-card>
                <v-img src="../assets/ipfs.png" alt="IPFS logo" class="text-center pt-5" height="200px" />
                <v-card-title> InterPlanetary File System </v-card-title>
                <v-card-subtitle>
                  We utilize this peer-to-peer network for distributed storage of accounts and research files.
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn icon @click="expanders.ipfs = !expanders.ipfs">
                    <v-icon>{{ expanders.ipfs ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
                  </v-btn>
                </v-card-actions>
                <v-expand-transition>
                  <div v-show="expanders.ipfs">
                    <v-card-text>
                      To avoid as many slow transactions with the blockchain as possible, we make use of IPFS for the
                      storage of all research media on our platform. Data is hashed and spread across a wide network,
                      allowing efficient access and ensuring security of material on the platform.
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-col>
            <v-col>
              <v-card>
                <v-img src="../assets/orcid_logo.png" alt="ORCID logo" class="text-center pt-5" height="200px" />
                <v-card-title> Integration with ORCID </v-card-title>
                <v-card-subtitle>
                  We leverage the de facto digital academic identifier to prove researchers' identity.
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn icon @click="expanders.orcid = !expanders.orcid">
                    <v-icon>{{ expanders.orcid ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
                  </v-btn>
                </v-card-actions>
                <v-expand-transition>
                  <div v-show="expanders.orcid">
                    <v-card-text>
                      ORCID is the leading standard for digital identities for academics, so we leverage their existing
                      auth0 system to validate researchers' profiles. Researchers attest to the ownership of an Ethereum
                      wallet, which can only be done on successful ORCID validation of their identity.
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-col>
            <v-col>
              <v-card>
                <v-img
                  src="../assets/metamaskPortis.png"
                  alt="metamask and Portis logos"
                  class="text-center pt-5"
                  height="200px"
                />
                <v-card-title> MetaMask and Portis web3 injection </v-card-title>
                <v-card-subtitle>
                  Both one-click access to the blockchain, and a frictionless user experience.
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn icon @click="expanders.metamask = !expanders.metamask">
                    <v-icon>{{ expanders.metamask ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
                  </v-btn>
                </v-card-actions>
                <v-expand-transition>
                  <div v-show="expanders.metamask">
                    <v-card-text>
                      Clients can access web3 through MetaMask if installed, which allows the direct interaction with
                      Ethereum dApps without running a full Ethereum node. Portis aims to ensure a frictionless
                      experience for users without a wallet, and will allow a much broader class of users to interact
                      with us.
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>

        <div class="text-h3">The <span class="font-weight-bold">people</span> behind UniCoin</div>
        <v-row>
          <v-col>
            <v-card>
              <v-img src="../assets/chris.jpg" alt="profile of Chris" />
              <v-card-title class="text-center">Chris</v-card-title>
              <v-card-subtitle>Head of Marketing</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-img src="../assets/helda.jpg" alt="profile of Helda" />
              <v-card-title class="text-center">Helda</v-card-title>
              <v-card-subtitle>Blockchain Developer</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-img src="../assets/luke.jpeg" alt="profile of Luke" />
              <v-card-title class="text-center">Luke</v-card-title>
              <v-card-subtitle>WebDev Lead</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
  <!--<div class="home">
    <div style="padding: 50px">
      <h1>The <span>people</span> behind UniCoin</h1>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item"></div>
      <div class="md-layout-item" style="padding: 40px">
        <md-card>
          <md-card-media>
            <img src="../assets/chris.jpg" alt="profile of Chris" />
          </md-card-media>

          <md-card-header class="text-center">
            <div class="md-title">Chris</div>
            <p>Head of Marketing</p>
          </md-card-header>
        </md-card>
      </div>

      <div class="md-layout-item" style="padding: 40px">
        <md-card>
          <md-card-media>
            <img src="../assets/helda.jpg" alt="profile of Helda" />
          </md-card-media>

          <md-card-header class="text-center">
            <div class="md-title">Helda</div>
            <p>Blockchain Developer</p>
          </md-card-header>
        </md-card>
      </div>

      <div class="md-layout-item" style="padding: 40px">
        <md-card>
          <md-card-media>
            <img src="../assets/luke.jpeg" alt="profile of Luke" />
          </md-card-media>

          <md-card-header class="text-center">
            <div class="md-title">Luke</div>
            <p>WebDev Lead</p>
          </md-card-header>
        </md-card>
      </div>
      <div class="md-layout-item"></div>
    </div>
  </div>-->
</template>
<style lang="scss" scoped>
.card-expansion {
  height: 480px;
}

.md-card {
  width: 320px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}
</style>

<script setup lang="ts">
import ClickableAddress from "@/components/widgets/ClickableAddress.vue";
import { computed, reactive } from "vue";

import { useStore } from "@/store/piniastore";
import { useRouter } from "vue2-helpers/vue-router";

const store = useStore();

const expanders = reactive({
  ethereum: false,
  ipfs: false,
  orcid: false,
  metamask: false,
});
</script>

<script>
/*import ClickableAddress from "@/components/widgets/ClickableAddress";
import { mapState } from "vuex";
import router from "@/router";
export default {
  name: "home",
  components: { ClickableAddress },
  methods: {
    goToBegin() {
      router.push({ name: "create" });
    },
  },
  computed: {
    ...mapState(["currentNetwork", "account"]),
  },
};*/
</script>
