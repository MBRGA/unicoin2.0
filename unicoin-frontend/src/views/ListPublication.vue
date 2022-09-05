<template>
  <v-app>
    <v-main>
      <v-stepper v-model="liststep">
        <v-stepper-header>
          <v-stepper-step :complete="liststep > 1" step="1"> Information and setup </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="liststep > 2" step="2"> Collaborators </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="liststep > 3" step="3"> Market settings </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="liststep > 4" step="4"> Deploy </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row>
              <v-col>
                <v-card>
                  <v-card-title>Add a new publication to the UniCoin marketplace🦄</v-card-title>
                  <v-card-subtitle
                    >Add a new publication to the UniCoin marketplace. This onboarding flow will guide you though
                    uploading your paper, linking other contributors and specifying the auction process used for selling
                    license.</v-card-subtitle
                  >
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-form v-model="setupData.valid">
                <v-col>
                  <v-card>
                    <v-card-title>Upload your paper</v-card-title>
                    <v-card-subtitle>Add your paper in PDF format, and help us look up metadata. 🗂</v-card-subtitle>
                    <v-file-input
                      label="Paper PDF"
                      accept="application/pdf"
                      v-model="setupData.pdfFile"
                      :rules="[requiredRule]"
                      @change="handleFileUpload()"
                    ></v-file-input>
                    <v-text-field 
                      label="Paper DOI"
                      v-model="setupData.doi"
                      :rules="[requiredRule]"
                      @change="handleDoiLookup()"
                      ></v-text-field>
                    <vue-pdf-embed v-if="!!pdfData" :source="pdfData"></vue-pdf-embed>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card>
                    <v-card-title>Key paper information</v-card-title>
                    <v-card-subtitle>Specify the key information about your paper. 📄</v-card-subtitle>
                    <v-text-field label="Paper title" v-model="setupData.title" :rules="[requiredRule]"></v-text-field>
                    <v-textarea
                      label="Paper abstract"
                      v-model="setupData.abstract"
                      auto-grow
                      :rules="[requiredRule]"
                    ></v-textarea>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card>
                    <v-card-title>Paper key words</v-card-title>
                    <v-card-subtitle>Label your publication so that others can find it more easily. 🔍</v-card-subtitle>
                    <v-combobox
                      v-model="setupData.keywords"
                      label="Keyword list"
                      multiple
                      chips
                      deletable-chips
                      placeholder="Nanotechnology..."
                      hint="Press enter to add keyword"
                      :rules="[requiredRule]"
                    ></v-combobox>
                  </v-card>
                </v-col>
              </v-form>
            </v-row>
            <v-btn @click="liststep = 2" color="primary" :disabled="!setupData.valid">Continue</v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-row>
              <v-col>
                <v-card>
                  <v-card-title>Specify paper contributors🎓</v-card-title>
                  <v-card-subtitle
                    >Attribute a percentage of your total income from your research to your paper contributors. They
                    will automatically receive a proportion of all licencing fees you receive. The allocation is
                    completely up to you.</v-card-subtitle
                  >
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="8">
                <v-card>
                  <v-card-title>Add contributors</v-card-title>
                  <v-card-subtitle
                    >Add contributors who were influential in developing your research. You can choose what percentage
                    allocation they will receive from the total funding pool.</v-card-subtitle
                  >
                  <v-form v-model="coAuthorForm.valid">
                    <v-card-text v-if="coAuthorForm.coAuthors.length > 0">
                      <v-row v-for="(contributor, index) of coAuthorForm.coAuthors" :key="contributor.id">
                        <v-col>
                          <v-combobox
                            v-model="contributor.name"
                            label="Contributor Name"
                            :rules="[requiredRule]"
                          ></v-combobox>
                        </v-col>
                        <v-col>
                          <clickable-address :light="false" :icon="true" :eth-address="contributor.address" />
                        </v-col>
                        <v-col>
                          <v-slider
                            v-model="contributor.weighting"
                            thumb-label="always"
                            min="0"
                            :max="contributor.weighting + remainingAllocation"
                            :disabled="!contributor.address"
                          >
                          </v-slider>
                        </v-col>
                        <v-col>
                          <v-btn color="accent" @click="removeContributor(index)">
                            <v-icon>mdi-minus</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-fab-transition>
                        <v-btn bottom right color="primary" @click="addContributor">
                          <v-icon>mdi-add</v-icon>
                        </v-btn>
                      </v-fab-transition>
                    </v-card-text>
                  </v-form>
                  <v-card-text v-if="coAuthorForm.coAuthors.length == 0">
                    <v-container class="text-center">
                      <v-icon size="160px">mdi-monitor-smartphone-star</v-icon>
                      <div class="text-h4">Add your first contributor</div>
                      <div>Add all the people that helped make your research a reality.</div>
                      <v-btn @click="addContributor" color="primary">Add first contributor</v-btn>
                      <v-form v-model="validAttributionFile">
                        <v-file-input
                          label="Upload auto attribution file"
                          persistent-hint
                          hint="A text file with lines of the form (author, address, weighting)"
                          v-model="autoAttribute"
                          accept="text/plain"
                          :rules="fileRules"
                          :disabled="!cachedText || !validAttributionFile"
                        >
                          <template v-slot:append-outer>
                            <v-btn @click="handleAutoAttributeFileUpload">Submit</v-btn>
                          </template>
                        </v-file-input>
                      </v-form>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col>
                <v-card>
                  <plotly-pie
                    v-if="pieData && coAuthorForm.coAuthors.length > 0"
                    :pieValues="pieData.values"
                    :pieLabels="pieData.labels"
                    :pieColors="colors"
                    :pieHole="0.7"
                  ></plotly-pie>
                  <v-card-text>Your allocation: {{ remainingAllocation.toFixed() }} %</v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-btn @click="liststep = 3" color="primary" :disabled="!coAuthorForm.valid">Continue</v-btn>
            <v-btn @click="liststep = 1">Back</v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-container>
              <v-row>
                <v-col>
                  <v-card>
                    <v-card-title>Choose how you want to sell licences to your research 📄 </v-card-title>
                    <v-card-subtitle
                      >You can choose to either list your research at auction or sell it at a fixed price per
                      licence</v-card-subtitle
                    >
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-card>
                    <v-card-title>Research market type</v-card-title>
                    <v-card-text>
                      <v-radio-group v-model="pricingForm.marketType" row>
                        <v-radio label="Fixed Price" value="fixedPrice"></v-radio>
                        <v-radio label="Sealed-Bid Auction" value="auction"></v-radio>
                        <v-radio label="Auction with Harberger Tax" value="h-auction"></v-radio>
                      </v-radio-group>
                      <p v-if="marketType == 'auction'">
                        Your publication will be listed as an auction. All potential buyers will submit a hidden bid,
                        and after one month all bids will be revealed and the licence will be awarded to the highest
                        bidder.
                      </p>
                      <div v-else-if="marketType == 'h-auction'">
                        <p>
                          Your publication will be listed as an auction. All potential buyers will submit a hidden bid,
                          and after one month all bids will be revealed and the licence will be awarded to the highest
                          bidder.
                        </p>
                        <p>
                          The licence will be tradeable under Harberger taxation rules. Owners will pay a fee to you
                          based on their valuation of the licence, and may be forced to sell in the case of higher bid
                          being made.
                        </p>
                      </div>
                      <div v-else>
                        <p>
                          Your publication will be listed at a fixed price. Buyers can purchase license immediately with
                          no restriction. Use this setting if you feel happy with setting one fixed price for all
                          licences.
                        </p>
                        <v-text-field
                          label="Price per licence (USD)"
                          v-model.number="pricingForm.pricePerLicence"
                        ></v-text-field>
                      </div>
                      <v-slider
                        v-model="pricingForm.maxLicences"
                        min="1"
                        max="10"
                        label="Maximum Issuable Licences"
                      ></v-slider>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-btn @click="liststep = 4" color="primary">Continue</v-btn>
              <v-btn @click="liststep = 2">Back</v-btn>
            </v-container>
          </v-stepper-content>

          <v-stepper-content step="4">
            <v-container>
              <v-row>
                <v-column>
                  <v-card>
                    <v-card-title> Review your publication information 🔍 </v-card-title>
                    <v-card-subtitle
                      >You're nearly ready to go. Review your publication's details below.</v-card-subtitle
                    >
                  </v-card>
                </v-column>
                <v-row>
                  <v-column cols="8">
                    <v-card>
                      <v-card-title>Publication summary</v-card-title>
                      <v-card-text>
                        <v-simple-table>
                          <tbody>
                            <tr>
                              <td>Paper Title</td>
                              <td>{{ setupData.title }}</td>
                            </tr>
                            <tr>
                              <td>Keywords</td>
                              <td>
                                <div v-for="kwd of setupData.keywords" :key="kwd">{{ kwd }}</div>
                              </td>
                            </tr>
                            <tr>
                              <td>Contributors</td>
                              <td>
                                <div v-for="contrib of coAuthorForm.coAuthors" :key="contrib.id">
                                  {{ contrib.name }}: {{ contrib.weighting }} %
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>Your allocation</td>
                              <td>{{ remainingAllocation }} %</td>
                            </tr>
                            <tr>
                              <td>Sale type</td>
                              <td>{{ marketType == "auction" ? "Auction" : "Fixed Price" }}</td>
                            </tr>
                            <tr v-if="marketType == 'fixedPrice'">
                              <td>Fixed price per licence</td>
                              <td>{{ pricePerLicence }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-card-text>
                    </v-card>
                  </v-column>
                  <v-column>
                    <v-card>
                      <v-card-text>
                        <vue-pdf-embed :source="pdfData"></vue-pdf-embed>
                      </v-card-text>
                    </v-card>
                  </v-column>
                </v-row>
              </v-row>
              <v-btn @click="deploy()" color="primary">Continue</v-btn>
              <v-btn @click="liststep = 3">Back</v-btn>
            </v-container>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-main>
  </v-app>
  <div class="page-container">
    <md-steppers style="margin: 20px" v-model:md-active-step="active" md-linear>
      <md-step
        id="fourth"
        md-label="Deploy"
        v-model:md-done="fourth"
        style="background: #f5f9f9; padding-left: 0px; marin: 0px; padding-right: 0px"
      >
        <div class="md-layout">
          <div class="md-layout-item">
            <md-content style="padding: 20px">
              <md-card-header>
                <div class="md-title">Review your publication information🔍</div>
              </md-card-header>
              <p>
                You can choose to either list your research on an auction where buyers will submit bids and you can
                choose to accept or sell it at a fixed price per licence.
              </p>
            </md-content>
            <br />
            <div class="md-layout md-gutter" v-if="deployed == false">
              <div class="md-layout-item">
                <md-content style="padding: 20px">
                  <md-card-header>
                    <div class="md-title">Publication summary</div>
                  </md-card-header>
                  <md-table v-if="pieData != null">
                    <md-table-row>
                      <md-table-cell>Paper title</md-table-cell>
                      <md-table-cell>{{ title }}</md-table-cell>
                    </md-table-row>
                    <md-table-row>
                      <md-table-cell>Paper keywords</md-table-cell>
                      <md-table-cell>
                        <div v-for="keyword in keywords">{{ keyword }}</div>
                      </md-table-cell>
                    </md-table-row>
                    <md-table-row>
                      <md-table-cell>Paper contributors</md-table-cell>
                      <md-table-cell>
                        <div v-for="contrubtor in contributorsSummary">{{ contrubtor }}</div>
                      </md-table-cell>
                    </md-table-row>
                    <md-table-row>
                      <md-table-cell>Your allocation</md-table-cell>
                      <md-table-cell>{{ remainingAllocation.toFixed(1) }}%</md-table-cell>
                    </md-table-row>
                    <md-table-row>
                      <md-table-cell>Sale type</md-table-cell>
                      <md-table-cell>{{ marketType }}</md-table-cell>
                    </md-table-row>
                    <md-table-row v-if="marketType == 'fixedPrice'">
                      <md-table-cell>Fixed price per licence</md-table-cell>
                      <md-table-cell>{{ pricePerLicence }}</md-table-cell>
                    </md-table-row>
                  </md-table>
                </md-content>
              </div>
              <div class="md-layout-item md-size-30">
                <div v-if="pdfFile != null" style="width: 250px">
                  <pdf :src="pdfFile" :page="1" :resize="true">
                    <template v-slot:loading>loading content here...</template>
                  </pdf>
                </div>
              </div>
            </div>
            <md-content style="padding: 20px" v-if="deployed == true">
              <img class="text-center" alt="step logo" style="height: 400px" src="../assets/unicorn_dabbing.png" />
            </md-content>
          </div>
        </div>
        <md-button class="md-raised md-primary" @click="deploy" style="margin-top: 20px">Finish🚀</md-button>
        <md-button class="md-raised" @click="setDone('fourth', 'third')" style="margin-top: 20px">Back</md-button>
      </md-step>
    </md-steppers>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, set } from "vue";
import { useStore } from "@/store/piniastore";
import { Publication } from "@/utils/ipfsUploader.js";
import type { Ref } from "vue";
import ClickableAddress from "@/components/widgets/ClickableAddress.vue";
import PlotlyPie from "@/components/PlotlyPie.vue";
import VuePdfEmbed from "vue-pdf-embed/dist/vue2-pdf-embed";
import axios from "axios";

const store = useStore();

const liststep = ref(0);

interface SetupData {
  pdfFile?: File;
  title: string;
  abstract: string;
  keywords: Array<string>;
  valid: boolean;
  doi: string;
}

const setupData: SetupData = reactive({
  pdfFile: undefined,
  title: "",
  abstract: "",
  keywords: [],
  valid: false,
  doi: "",
});

const pdfData: Ref<string | null> = ref(null);

const requiredRule = (v: unknown) => !!v || "Required";

// Pie chart colours
const colors = [
  "#A8A2F5",
  "#E66C82",
  "#F8D771",
  "#9BECBE",
  "#4371E0",
  "#CC83E9",
  "#F77D6A",
  "#D5F871",
  "#67E6ED",
  "#7B66F7",
];

const deployed = ref(false);

// For validation of auto attribution file
const fileRules = [
  (v: File) => !v || v.size <= 10000 || "File shouldn't be larger than 10KB",
  (v: File) => !v || validateAttributionFile(v) || "File doesn't have expected format",
];

interface Contributor {
  id: number;
  name: string;
  address: string;
  weighting: number;
}

let numContribs = 0;

const coAuthorForm: {
  valid: boolean;
  coAuthors: Array<Contributor>;
} = reactive({ valid: false, coAuthors: [] });

const pricingForm: {
  marketType: "auction" | "h-auction" | "fixedPrice";
  pricePerLicence: number;
  maxLicences: number;
} = reactive({ marketType: "auction", pricePerLicence: 100, maxLicences: 1 });

function addContributor() {
  coAuthorForm.coAuthors.push({ id: numContribs++, name: "", address: "", weighting: 0 });
}
function removeContributor(index: number) {
  coAuthorForm.coAuthors.splice(index, 1);
}

async function handleFileUpload() {
  if (!setupData.pdfFile) return;

  const reader = new FileReader();

  reader.onload = () => {
    pdfData.value = reader.result as string | null;
  };

  reader.readAsDataURL(setupData.pdfFile);
}

async function handleDoiLookup() {
  if (!setupData.doi) return;

  const doi_dat = await axios.get<>(`${process.env.BACKEND_ADDRESS}/FindDoi/${setupData.doi}`);
}

// Functions to verify and process an auto attribution text file
let cachedText: string | null;

// Looking for comma-separated values:
// Name - word characters and spaces (making sure last character is not a space)
// Address - 40 hex characters with 0x prefix
// Weighting - digits
// Also allowing for whitespace padding around each group
const validRow =
  /^[^\S\r\n]*(?<name>[\w ]*[\w])[^\S\r\n]*,[^\S\r\n]*(?<address>0x[0-9a-fA-F]{40})[^\S\r\n]*,[^\S\r\n]*(?<weight>\d+)[^\S\r\n]*$/;

async function validateAttributionFile(file: File): Promise<boolean> {
  const fileText = await file.text();

  const rows = fileText.split(/\r?\n/);
  // Check for rows that don't match regex, and return their index
  // (Good rows will have value of -1 after the map, and get filtered out)
  const badrows = rows.map((v, i) => (validRow.test(v) ? -1 : i)).filter((v) => v >= 0);

  if (badrows.length) {
    console.log(badrows);
    cachedText = null;
    return false;
  }

  cachedText = fileText;
  return true;
}

const validAttributionFile = ref(false);

function handleAutoAttributeFileUpload() {
  if (!cachedText) {
    console.error("handleAutoAttributeFileUpload called without first verifying data");
    throw "Invalid function call";
  }

  const rows = cachedText.split(/\r?\n/);

  for (const row of rows) {
    const rowvals = validRow.exec(row);

    if (!rowvals?.groups) continue;

    coAuthorForm.coAuthors.push({
      id: numContribs++,
      name: rowvals.groups.name,
      address: rowvals.groups.address,
      weighting: Number(rowvals.groups.weight),
    });
  }
}

// Calculates the number of percentage points still available after adding together existing weightings
const remainingAllocation = computed(() => {
  return Math.max(100 - coAuthorForm.coAuthors.map((c) => c.weighting).reduce((prev, cur) => prev + cur, 0), 0);
});

const pieData = computed(() => {
  return {
    values: [remainingAllocation, ...coAuthorForm.coAuthors.map((v) => v.weighting)],
    labels: ["Dr Frankenstein", ...coAuthorForm.coAuthors.map((v) => v.name)],
  };
});

async function deploy() {
  if (!pdfData.value) throw "Unable to deploy - no PDF provided";

  console.log("LAUNCH");
  deployed.value = !deployed.value;

  const contributorAddresses = coAuthorForm.coAuthors.map((v) => v.address);
  const contributorWeighting = coAuthorForm.coAuthors.map((v) => v.weighting);
  //const priceStrat = marketType.value === "auction" ? PricingStrategy. : false;
  let priceStrat: PricingStrategy;

  switch (pricingForm.marketType) {
    case "auction":
      priceStrat = PricingStrategy.PrivateAuction;
      break;
    case "h-auction":
      priceStrat = PricingStrategy.PrivateAuctionHarberger;
      break;
    default:
      priceStrat = PricingStrategy.FixedRate;
  }

  const sellPrice = pricingForm.marketType !== "fixedPrice" ? 0 : pricingForm.pricePerLicence;

  const publicationObject = new Publication(
    setupData.title,
    setupData.abstract,
    setupData.keywords,
    contributorAddresses,
    contributorWeighting,
    sellPrice,
    priceStrat,
    AuctionStatus.Pending,
    pdfData.value
  );

  console.log(publicationObject);
  this.LIST_PUBLICATION(publicationObject);

  await store.listPublication()
}
</script>

<script>
import { mapActions, mapState } from "vuex";

//import ClickableAddress from "@/components/widgets/ClickableAddress";

import VuePlotly from "@statnett/vue-plotly";
//import { constants } from "fs";

import pdf from "pdfvuer";
import { AuctionStatus, PricingStrategy } from "@/utils/enums.js";

export default {
  name: "manage",
  components: { ClickableAddress, VuePlotly, pdf },
  data: () => ({
    active: "first",
    first: false,
    second: false,
    third: false,
    fourth: false,
    pdfFile: null,
    pdfName: null,
    autoAttribute: null,
    title: "",
    abstract: "",
    keywords: [],
    coAuthor: [
      // {
      //   name: "Sabine Bertram",
      //   address:
      //     "0x9a7b53a5f6b24b71b182f1fc8e4ca6db0e63b6c63c7ab4b72c08f02329bdf9ea",
      //   weighting: 0
      // }
    ],
    authorList: [
      "Sabine Bertram",
      "Daniel Opolot",
      "Suraj Shekhar",
      "Jesper Riedler",
      "Christine Makanza",
      "Pawel Fiedor",
      "Hylton Hollander",
    ],
    authorsAddresses: ["2", "3", "4", "5", "6", "7", "8"],
    selectedAuthor: "",
    SplitWithOthers: 0,
    colors: [
      "#A8A2F5",
      "#E66C82",
      "#F8D771",
      "#9BECBE",
      "#4371E0",
      "#CC83E9",
      "#F77D6A",
      "#D5F871",
      "#67E6ED",
      "#7B66F7",
    ],
    pieOptions: {
      responsive: false,
      showLink: false,
      displayModeBar: false,
      sort: false,
    },
    pieLayout: {
      margin: {
        l: 55,
        r: 55,
        b: 55,
        t: 55,
        pad: 20,
      },
    },
    deployed: false,
    marketType: "auction",
    pricePerLicence: 100,
  }),
  methods: {
    ...mapActions(["LIST_PUBLICATION"]),
    handleFileUpload(file) {
      var reader = new FileReader();
      let scopedThis = this;
      reader.readAsDataURL(file[0]);
      reader.onload = function () {
        scopedThis.pdfFile = reader.result;
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    },

    handelAutoAttributeFileUpload(file) {
      var reader = new FileReader();
      reader.readAsText(file[0]);
      let scopedThis = this;
      reader.onload = function () {
        let rows = reader.result.split("\n");
        rows.map((v) => {
          scopedThis.coAuthor.push({
            name: v.split(",")[0],
            address: v.split(",")[1],
            weighting: v.split(",")[2],
          });
        });
      };
    },
    setDone(id, index) {
      this[id] = true;

      this.secondStepError = null;

      if (index) {
        this.active = index;
      }
    },
    deploy() {
      console.log("LAUNCH");
      this.deployed = !this.deployed;

      let contributorAddresses = this.coAuthor.map((v) => v.address);
      let contributorWeighting = this.coAuthor.map((v) => v.weighting);
      let isAuction = this.marketType === "auction" ? true : false;
      let sellPrice = this.marketType === "auction" ? 0 : this.pricePerLicence;

      let publicationObject = {
        title: this.title,
        abstract: this.abstract,
        keyword: this.keywords,
        contributors: [this.userNumber, ...contributorAddresses],
        contributorsWeightings: [this.remainingAllocation, ...contributorWeighting],
        sellPrice: sellPrice,
        isAuction: isAuction,
        pdfFile: this.pdfFile,
      };
      console.log(publicationObject);
      this.LIST_PUBLICATION(publicationObject);
    },
    /*addContributor() {
      this.coAuthor.push({ name: "", address: "", weighting: 0 });
    },
    removeContributor(index) {
      this.coAuthor.splice(index, 1);
    },
    changeContribution(index, name) {
      this.coAuthor[index].address = this.authorsAddresses[this.authorList.indexOf(name)];
    },
    slideContribution(index) {
      console.log("SLIDE");
    },*/
  },
  computed: {
    ...mapState(["userNumber"]),
    sliderOptions() {
      return {
        process: ([pos, i]) => [
          [0, pos],
          [pos, pos + this.remainingAllocation, { backgroundColor: "#999" }],
        ],
      };
    },
    /*remainingAllocation() {
      if (this.coAuthor.length == 0) {
        return 100;
      } else {
        let weightings = this.coAuthor.map((v) => v.weighting);
        console.log(weightings);
        console.log(weightings.reduce((sum, value) => sum + value, 0));
        return this.coAuthor.map((v) => v.weighting).reduce((sum, value) => sum - value, 100);
      }
    },*/
    /*pieData() {
      return [
        {
          values: [this.remainingAllocation, ...this.coAuthor.map((v) => v.weighting)],
          labels: ["Dr Frankenstein", ...this.coAuthor.map((v) => v.name)],
          hole: 0.7,
          type: "pie",
          sort: "false",
          marker: {
            colors: this.colors,
          },
        },
      ];
    },*/
    contributorsSummary() {
      return this.coAuthor.map((v, i) => `${v.name}: ${v.weighting}%`);
    },
  },
};
</script>
