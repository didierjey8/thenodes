<template>
  <div class="container">
    <b-row>
      <b-col
        cols="3"
        class="mb-4"
        style="
            position: relative;
            display: inline-block;
            background-color: #5678EF;
            color: white;
            display: flex;            
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            content: 'Select'; 
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            inset:10px!important 
            heigth:10px;
            width: 10%;
      "
      >
        <b-form-file
          id="filetoupload"
          name="filetoupload"
          style="
                opacity: 0;
                width: 200px;
                height: 32px;
                display: inline-block;
                content: 'upload'!important;
                color:#fff;"
          @change="previewFiles"
        ></b-form-file>
      </b-col>

      <b-col cols="3" class="mb-3">
        <b-button
          variant="primary"
          v-b-modal.modal-add
          style="height: 33px;top: 10px;position: relative;width: 104px;left: 100px;"
          >Add</b-button
        >
      </b-col>
      <b-modal id="modal-add" title="Add Childre">
        <b-form-group
          id="parent_group"
          label="Parent"
          label-for="parent"
          description="."
        >
          <b-form-input
            id="parent"
            v-model="parent"
            type="number"
            placeholder="Parent"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="name_group"
          label="name:"
          label-for="name"
          description="."
        >
          <b-form-input
            id="Name"
            v-model="Name"
            type="text"
            placeholder="Name"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="description_group"
          label="Description:"
          label-for="description"
          description="."
        >
          <b-form-input
            id="description"
            v-model="description"
            type="text"
            placeholder="Description"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="read_only_group"
          label="Read nly:"
          label-for="read only"
          description="."
        >
          <b-form-input
            id="read_only"
            v-model="read_only"
            type="number"
            placeholder="Read only"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-button
          style="left: 205px;position: relative;"
          class="align-items-center"
          variant="primary"
          @click="add"
          >Add</b-button
        >
      </b-modal>

      <b-col cols="3" class="mb-3">
        <b-button
          variant="info"
          v-b-modal.modal-update
          style="height: 33px;top: 10px;position: relative;width: 104px;left: 100px;"
          >Update</b-button
        >
      </b-col>
      <b-modal id="modal-update" title="BootstrapVue">
        <b-form-group
          id="id_updat_group"
          label="id Update"
          label-for="id_update"
          description="."
        >
          <b-form-input
            id="id_update"
            v-model="id_update"
            type="number"
            placeholder="id update"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="name_update_group"
          label="name update"
          label-for="name_update"
          description="."
        >
          <b-form-input
            id="name_update"
            v-model="name_update"
            type="text"
            placeholder="Name Update"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-button
          style="left: 205px;position: relative;"
          class="align-items-center"
          variant="primary"
          @click="update"
          >Update</b-button
        >
      </b-modal>

      <b-col cols="3" class="mb-3">
        <b-button
          variant="warning"
          v-b-modal.modal-delete
          style="height: 33px;top: 10px;position: relative;width: 104px;    left: 119px;"
          >Delete</b-button
        >
      </b-col>

      <b-modal id="modal-delete" title="BootstrapVue">
        <b-form-group
          id="id_delete_group"
          label="id delete"
          label-for="id_delete"
          description="."
        >
          <b-form-input
            id="id_delete"
            v-model="id_delete"
            type="number"
            placeholder="id delete"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-button
          style="left: 205px;position: relative;"
          class="align-items-center"
          variant="primary"
          @click="delet"
          >Delete</b-button
        >
      </b-modal>
    </b-row>

    <vue-tree
      style="width: 800px; height: 600px; border: 1px solid gray;"
      :dataset="showData"
      :config="treeConfig"
    >
    </vue-tree>
  </div>
</template>
<script>
var url_base = "https://thenodesapi.concilbot.com/";
import VueTree from "@ssthouse/vue-tree-chart";
import Vue from "vue";
Vue.component("vue-tree", VueTree);
import ArrayTree from "array-to-tree";
Vue.component("array-to-tree", ArrayTree);

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

export default {
  name: "treemap",
  data() {
    return {
      parent: "",
      Name: "",
      description: "",
      read_only: "",

      id_update: "",
      name_update: "",

      id_delete: "",

      showData: {},
      treeConfig: { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 },
    };
  },
  methods: {
    loadNewData(datos) {
      var reusult = ArrayTree(datos, {
        parentProperty: "parent",
        customID: "value",
      });
      var result2 = Object.assign({}, reusult);
      this.showData = result2["0"];
    },
    async add() {
      let json = {
        parent: this.parent,
        node: {
          name: this.name,
          description: this.description,
          read_only: this.read_only,
        },
      };
      let data = await this.sendData(url_base + "create_node", "POST", json);

      this.loadNewData(data);
    },
    async delet() {
      let json = {
        id: this.id_delete,
      };
      let data = await this.sendData(url_base + "delete_node", "POST", json);
      this.loadNewData(data);
    },
    async update() {
      let json = {
        id: this.id_update,
        name: this.name_update,
      };
      let data = await this.sendData(url_base + "update_node", "POST", json);
      this.loadNewData(data);
    },
    async previewFiles() {
      const input = document.getElementById("filetoupload");
      var data = await this.SendFile(url_base + "get_tree", "POST", input);
      this.loadNewData(data);
    },
    async SendFile(url, method, file) {
      const formData = new FormData();
      formData.append("filetoupload", file.files[0]);
      let res = await fetch(url, {
        method: method,
        body: formData,
      }).catch(function(error) {
        console.log("Looks like there was a problem: \n", error);
      });
      let data = await res.json();
      jsonObject = JSON.stringify(data);
      let jsonObject = JSON.parse(jsonObject.replace(/"id":/g, '"value":'));
      console.log(jsonObject);
      return jsonObject;
    },
    async sendData(url, method, objData) {
      let res = await fetch(url, {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objData),
      });
      let data = await res.json();
      return (data = JSON.stringify(data));
    },
  },
};
</script>
