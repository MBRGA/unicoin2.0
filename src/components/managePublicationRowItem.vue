<template>
  <v-card class="mx-auto pa-7">
      <v-row>
        <v-col>
      <v-card-title class="text-heading-5">{{publicationInformation.title}}</v-card-title>
      <v-card-subtitle>
        <div><span class="text-subtitle-1 pr-4">{{publicationInformation.authorFirstName}} {{publicationInformation.authorLastName }}</span>
          <img alt="ORCID logo" style="height: 0.875rem" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/ORCID_iD.svg/2048px-ORCID_iD.svg.png" />
          <a :href="`https://orcid.org/${publicationInformation.authorOrcid}`" target="_blank" class="text-body-2">https://orcid.org/{{ publicationInformation.authorOrcid }}</a>
        </div>
        <div class="text-subtitle-2">{{ publicationInformation.authorUniversity }}</div>
      </v-card-subtitle>
      <v-card-text class="pb-7">
        <div class="text-subtitle-2">Abstract</div>
        <div class="text-caption">
          <p>{{ publicationInformation.abstract }}</p>
        </div>
        <div class="text-subtitle-2">Keywords</div>
        <div class="text-caption">
          <p>{{ publicationInformation.keyword.toString() }}</p>
        </div>
        <v-divider v-if="publicationInformation.isAuction" class="my-6"></v-divider>
        <p v-if="publicationInformation.isAuction" class="text-heading-6">Any pending bids will appear here.</p>
        <div v-for="bid in publicationInformation.bids" :key="bid.id">
          <div class="text-body-2" v-if="bid.status === 0">
            <div v-if="publicationInformation.isAuction">
              <p><span class="font-weight-bold">Bid offer: </span>&nbsp; {{ formatter.format(bid.offer) }} </p>
              <p><span class="font-weight-bold">Offered by: </span>&nbsp; {{bid.bidderFirstName}} {{ bid.bidderLastName }}, {{ bid.bidderCompanyName }}</p>
              <v-row class="py-4 justify-end">
                <v-btn color="primary" class="ma-4 px-10" @click="showReject">
                  Reject
                </v-btn>
                <v-btn color="primary" class="ma-4 px-10" @click="showAccept">
                  Accept
                </v-btn>
                <v-dialog v-model="acceptDialog.visible" persisent max-width='290'>

                  <v-card>
                    <v-card-title class="primary white--text">{{acceptDialog.title}}</v-card-title>
                    <v-card-text class="mt-10">{{acceptDialog.text}}</v-card-text>
                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text @click="processAccept('{{this.acceptDialog.action}}', false)">
                        {{acceptDialog.oktext}}
                      </v-btn>
                      <v-btn text @click="processAccept('', false)">
                        Cancel
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>

            </div>
          </div>
        </div>
        <v-divider class="my-6"></v-divider>
        <p class="text-heading-6">You can review and change your publication's details below.</p>
        <v-row class="text-caption" no-gutters>
          <v-col class="font-weight-bold" cols="4" align-self="start">Commercial licensing details:
          </v-col>
          <v-col v-if="publicationInformation.isAuction" align-self="start">You have elected to sell commercial licences to your work through an auction.
          </v-col>
          <v-col v-else align-self="start">
            <v-row no-gutters>
              You have elected to sell commercial licences at a flat rate.
            </v-row>
            <v-row no-gutters>
              <span class="font-weight-bold">Flat rate: </span>&nbsp; {{ formatter.format(publicationInformation.sellPrice) }}
            </v-row>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <v-row class="justify-end py-4">
          <v-col cols='8'>
            <v-chip class="my-4 py-1" color="green" :outlined="publicationInformation.isRunning" :disabled="publicationInformation.isRunning" @click="publicationInformation.isRunning = !publicationInformation.isRunning">
              {{ publicationInformation.isRunning ? "Sale is running" : "Start Sale" }}
              <v-icon right>mdi-play-circle</v-icon>
            </v-chip>
            <v-chip class="my-4 py-1" color="red" :outlined="!publicationInformation.isRunning" :disabled="!publicationInformation.isRunning" @click="publicationInformation.isRunning = !publicationInformation.isRunning">
              {{ !publicationInformation.isRunning ? "Sale is not running" : "Stop Sale" }}
              <v-icon right>mdi-stop-circle</v-icon>
            </v-chip>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols='2'>
            <v-btn class="ma-4 px-10" color="accent" @click="showChangePrice">
              Change
            </v-btn>
          </v-col>
        </v-row>
        <v-dialog v-model="priceDialog.visible" persistent max-width='500'>
          <v-card>
            <v-card-title class="primary white--text"> Change licensing options </v-card-title>
            <v-card-text class="mt-5">
              <v-row class="justify-space-around">
                <v-col cols=5 align-self="center" class="text-right body-1 font-weight-bold" :class="{'text--disabled': priceDialog.isAuction}">Fixed Price</v-col>
                <v-col>
                  <v-switch v-model="priceDialog.isAuction" class="centered-switch">
                    <template v-slot:label>
                    </template>
                  </v-switch>
                </v-col>
                <v-col cols=5 align-self="center" class="text-left body-1 font-weight-bold" :class="{'text--disabled': !priceDialog.isAuction}">Auction</v-col>
              </v-row>
            </v-card-text>
            <v-card-text>
              <Transition name="switch-text" mode="out-in">
                <div v-if="!priceDialog.isAuction">
                  <p>Your publication will be licensed at a fixed price. Please select the price at which you would like to license your work:</p>
                </div>
                <p v-else>Your publication will now be for sale through an auction. Bidders will submit prices to you, which you
                  will need to review and accept or reject.</p>
              </Transition>
              <v-expand-transition>
                <v-text-field v-model.string="priceDialog.newPrice" v-if="!priceDialog.isAuction" @beforeinput="limitDigits" label="Flat rate" prefix="USD $" :rules="[rules.price]" type="number" in=1 pattern="[0-9]+"></v-text-field>
              </v-expand-transition>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="priceDialog.visible = false;" text>Discard</v-btn>
              <v-btn @click="priceDialog.confirmationDialog = true;" text :disabled="(priceDialog.newPrice === publicationInformation.sellPrice && priceDialog.isAuction === publicationInformation.isAuction)">Confirm Changes</v-btn>
            </v-card-actions>
            <v-dialog v-model="priceDialog.confirmationDialog" persistent max-width='350'>
              <v-card>
                <v-card-title class="primary white--text"> Confirm new licensing </v-card-title>
                <v-card-text class="mt-5">
                  <p v-if="priceDialog.isAuction">Are you sure you want to put this publication up for auction?</p>
                  <p v-else>Are you sure you wish to sell rights to this publication for a fixed price of $ {{ formatter.format(priceDialog.newPrice) }}?</p>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="priceDialog.confirmationDialog = false;" text>Cancel</v-btn>
                    <v-btn @click="confirmPriceChange" text>Confirm</v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-card>
        </v-dialog>
        <v-row class="justify-end">
        </v-row>
      </v-card-text>
      </v-col>
      <v-col cols='3'>
        <v-card v-id="publicationInformation.pdfFile">
          <pdf :src="publicationInformation.pdfFile" :page="1" :resize="true">
            <template v-slot:loading> loading content here </template>
          </pdf>
        </v-card>
      </v-col>
      </v-row>
    </v-card>
</template>

<script lang="ts">
import defineComponent from 'vue'
import { mapActions, mapState } from "vuex";
//import pdf from "pdfvuer";
import pdf from 'vue-pdf';

export default defineComponent({
  data() {
    return {
      formatter: new Intl.NumberFormat(undefined, {style:'currency', currency:'USD'}),
      acceptDialog: {
        visible: false,
        title: "Accept Bid?",
        text: "Are you sure you would like to accept this bid?",
        oktext: "ACCEPT BID",
        action: "",
      },
      priceDialog: {
        visible: false,
        isAuction: true,
        newPrice: null,
        confirmationDialog: false,
      },
    }
  }
})

/*export default Vue.extend({
  name: "managePublicationRowItem",
  components: { pdf },
  data() { 
    return {
      formatter: new Intl.NumberFormat(undefined, {style:'currency', currency:'USD'}),
      acceptDialog: {
        visible: false,
        title: "Accept Bid?",
        text: "Are you sure you would like to accept this bid?",
        oktext: "ACCEPT BID",
        action: "",
      },
      priceDialog: {
        visible: false,
        isAuction: true,
        newPrice: null,
        confirmationDialog: false,
      },
      offer: 0, 
      price: 0,
    },
  }
  props: {
    publicationInformation: {
      type: Object,
      required: true,
    },
  },
  name: "DialogCustom",
  data: () => ({
    showDialog1: false,
    showDialog2: false,
    showDialog3: false,
    showDialog4: false,
    showDialog5: false,
  }),
  name: "ButtonVsLink",
  computed: {
    pageUrl() {
      return window.location.href;
    },
  },

  methods: {
    ...mapActions([
      "ACCEPT_BID",
      "REJECT_BID",
      "GET_USER_PROFILE",
      "CHANGE_TO_SALE",
      "CHANGE_TO_AUCTION",
      "CHANGE_RUNNING_STATUS",
      "CHANGE_SELL_PRICE",
    ]),
    acceptBid(bidId) {
      console.log("Accepting bid...");
      this.ACCEPT_BID({
        bidId: bidId,
      });
    },
    rejectBid(bidId) {
      console.log("Rejecting bid...");
      this.REJECT_BID({
        bidId: bidId,
      });
    },
    changeToSale() {
      console.log("Changing to sale...");
      this.CHANGE_TO_SALE({
        publicationId: this.publicationInformation.publicationId,
        sellPrice: this.price,
      });
    },
    changeToAuction() {
      console.log("Changing to auction...");
      this.CHANGE_TO_AUCTION({
        publicationId: this.publicationInformation.publicationId,
      });
    },
    changeRunningStatus() {
      console.log("Changing running status...");
      this.CHANGE_RUNNING_STATUS({
        publicationId: this.publicationInformation.publicationId,
      });
    },
    changeSellPrice() {
      console.log("Changing sell price...");
      this.CHANGE_SELL_PRICE({
        publicationId: this.publicationInformation.publicationId,
        sellPrice: this.price,
      });
    },
  },
});*/
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
</style>
