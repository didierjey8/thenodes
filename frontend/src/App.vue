<template>
  <div class="container" @click="cargarNewData()">
    <vue-tree
      style="width: 800px; height: 600px; border: 1px solid gray;"
      :dataset="sampleData"
      :config="treeConfig"
    >
    </vue-tree>
  </div>
</template>

<script>
import VueTree from "@ssthouse/vue-tree-chart";
import Vue from "vue";
Vue.component("vue-tree", VueTree);

export default {
  name: "treemap",
  data() {
    return {
      info: "",
      sampleData: {
        value: "Base",
        children: [
          { value: "0", children: [{ value: "4" }, { value: "5" }] },
          { value: "0" },
          { value: "0" },
        ],
      },
      treeConfig: { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 },
    };
  },
  mounted() {
    this.cargarNewData();
  },
  methods: {
    async cargarNewData() {
      const res = await fetch("https://thenodesapi.concilbot.com/showdata");
      let data = await res.json();
      data = JSON.stringify(data);
      data = JSON.parse(data.replace(/"id":/g, '"value":'));
      var resultado = this.translateDataToTree(data);
      //var result2 = Object.assign({}, resultado);

      console.log(JSON.stringify(resultado));
      //console.log("Veamos" + JSON.stringify(result2["0"]));
      this.sampleData = JSON.parse(resultado);
    },
    translateDataToTree: function(data) {
      let parents = data.filter(
        (value) =>
          value.parent == "undefined" ||
          value.parent == null ||
          value.parent == 0
      );
      let children = data.filter(
        (value) =>
          (value.parent !== "undefined" && value.parent != null) ||
          value.parent == 0
      );
      let translator = (parents, children) => {
        parents.forEach((parent) => {
          children.forEach((current, index) => {
            if (current.parentId === parent.value) {
              let temp = JSON.parse(JSON.stringify(children));
              temp.splice(index, 1);
              translator([current], temp);
              typeof parent.children !== "undefined"
                ? parent.children.push(current)
                : (parent.children = [current]);
            }
          });
        });
      };
      translator(parents, children);
      return parents;
    },
  },
};
</script>
