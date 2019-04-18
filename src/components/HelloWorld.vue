<template>
  <div class="hello">
    <div id="myDiagramDiv" style="width:800px;height:600px;background-color:＃DAE4E4;margin:0 auto;"></div>
  </div>
</template>

<script>
import go from 'gojs'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      nodes:[],
      linkDataArray:[]
    }
  },
  methods: {
    gojs () {
      var $ = go.GraphObject.make;
      
      var diagram =
        $(go.Diagram, "myDiagramDiv",
          {
            "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
            layout: $(go.TreeLayout, // specify a Diagram.layout that arranges trees
                      { angle: 90, layerSpacing: 135 }),
            initialAutoScale: go.Diagram.UniformToFill,
            padding: 10,
            contentAlignment: go.Spot.Center,
            layout: $(go.ForceDirectedLayout, { defaultSpringLength: 10 }),
            maxSelectionCount: 2 
          });
      diagram.nodeTemplate =
        $(go.Node,"Vertical",
          {
            locationSpot: go.Spot.Center,  // Node.location is the center of the Shape
            locationObjectName: "SHAPE",
            selectionAdorned: true
            
            // selectionChanged: nodeSelectionChanged
          },
          $(go.Picture,
            { maxSize: new go.Size(50, 50) },
            new go.Binding("source", "imgs")),
          $(go.TextBlock,
            { margin: new go.Margin(3, 0, 0, 0),
              maxSize: new go.Size(100, 30),
              isMultiline: false },
            new go.Binding("text", "text")),
          {
            click: function (e, obj, ) {console.log(obj.part.data)}
          }
        )
            
          // new go.Binding("itemArray","items"));
      diagram.linkTemplate =
        $(go.Link,
          { 
            // routing: go.Link.Orthogonal, 
            corner: 5, 
            curve: go.Link.Bezier,
            layerName: "Background"  // 控制线段不遮挡节点
          },
          $(go.Shape, {stroke: "black"}),                            //这是链接形状(行) 
          $(go.Shape,{ toArrow:"Standard" }),   //这是一个箭头 
          $(go.TextBlock,                         //这是一个链接标签
            new go.Binding("text","text")),
          {
            click: function (e, obj) {console.log(obj.part.data)}, // 点击线体执行事件
            mouseEnter: function(e, link) {link.elt(0).stroke = "red"}, // 鼠标移入改变线体颜色
            mouseLeave: function(e, link) {link.elt(0).stroke = "black"; } // 鼠标移出改变线体颜色
          }  
        );
        diagram.model = new go.GraphLinksModel(this.nodes, this.linkDataArray);
      // diagram.model =
      //   $(go.GraphLinksModel,
      //     {
      //       nodeDataArray:[
      //         // { key:1,items:[ "Alpha","Beta","Gamma","Delta" ]},
      //         // { key:2,items:[ "first","second","third" ]}
      //         {key:1, text: "kitten", imgs: require("@/assets/img/dx.png") },
      //         {key:2, text: "liujun", imgs: require("@/assets/img/relation/add.png") },
      //         {key:3, text: "wangqi", imgs: require("@/assets/img/dx.png") }          ],
      //       linkDataArray:[
      //         { from:1,to:2,text: '123' },
      //         { from:2,to:3,text: '456' }
      //       ]
      //     });
    }
  },
  mounted() {
    this.nodes =[
              // { key:1,items:[ "Alpha","Beta","Gamma","Delta" ]},
              // { key:2,items:[ "first","second","third" ]}
              {key:1, text: "雷风平", imgs: require("@/assets/img/dx.png") },
              {key:2, text: "刘林", imgs: require("@/assets/img/relation/add.png") },
              {key:3, text: "袁英", imgs: require("@/assets/img/dx.png") },
              {key:4, text: "郭兴梅", imgs: require("@/assets/img/dx.png") },
              {key:17, text: "刘燕", imgs: require("@/assets/img/dx.png") },
              {key:5, text: "王泽波", imgs: require("@/assets/img/dx.png") },
              {key:6, text: "12368", imgs: require("@/assets/img/dx.png") }, 
              {key:7, text: "11183", imgs: require("@/assets/img/dx.png") },  
              {key:8, items: ["平安报警", "95511"], imgs: require("@/assets/img/dx.png") },        
              {key:9, text: "95598", imgs: require("@/assets/img/dx.png") },
              {key:10, text: "11183", imgs: require("@/assets/img/dx.png") },
              {key:11, text: "10086", imgs: require("@/assets/img/dx.png") },
              {key:12, text: "12123", imgs: require("@/assets/img/dx.png") },
              {key:13, text: "1065813919", imgs: require("@/assets/img/dx.png") },
              {key:14, text: "106980095533", imgs: require("@/assets/img/dx.png") },
              {key:15, items: ["喻宗华", "13883278999"], imgs: require("@/assets/img/dx.png") },
              {key:16, items: ["重庆陈明玉新", "13629724086"], imgs: require("@/assets/img/dx.png") },
            ];
    this.linkDataArray = [
              { from:6, to:1,text: '(2)次' },
              { from:6, to:4,text: '(4)次' },
              { from:7, to:1,text: '(4)次' },
              { from:7, to:5,text: '(3)次' },
              { from:9, to:1,text: '(4)次' },
              { from:9, to:2,text: '(4)次' },
              { from:8, to:1,text: '(4)次' },
              { from:8, to:2,text: '(4)次' },
              { from:13, to:1,text: '(4)次' },
              { from:13, to:3,text: '(4)次' },
              { from:13, to:17,text: '(4)次' },
              { from:14, to:1,text: '(4)次' },
              { from:14,to:3,text: '(4)次' },
              { from:14, to:17,text: '(4)次' },
              { from:15, to:2,text: '(4)次' },
              { from:15, to:5,text: '(4)次' },
              { from:16, to:3,text: '(4)次' },
              { from:16, to:1,text: '(4)次' },
              { from:12, to:3,text: '(4)次' },
              { from:12, to:17,text: '(4)次' },
              { from:11, to:1,text: '(4)次' },
              { from:11, to:3,text: '(4)次' },
              { from:11, to:4,text: '(4)次' },
              { from:11, to:17,text: '(4)次' },
              { from:11, to:5,text: '(4)次' },
              { from:10, to:1,text: '(4)次' },
              { from:10, to:5,text: '(4)次' },
            ]
    // var $ = go.GraphObject.make
    // var myDiagram = $(go.Diagram, "myDiagramDiv", {
    //   // 启用Ctrl-Z撤消,Ctrl-Y重做
    //   "undoManager.isEnabled": true
    // })
    // var myModal = $(go.Model)
    // myModal.nodeDataArray = [
    //   {key: "Alpha"},
    //   {key: "Beta"},
    //   {key: "Gamma"},
    //   {key: "liujun"}
    // ] 
    // myDiagram.model = myModal

    // var $ = go.GraphObject.make;
    // var myDiagram =
    //   $(go.Diagram, "myDiagramDiv",
    //     {
    //       "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
    //       layout: $(go.TreeLayout, // specify a Diagram.layout that arranges trees
    //                 { angle: 90, layerSpacing: 35 })
    //     });

    // // the template we defined earlier
    // myDiagram.nodeTemplate =
    //   $(go.Node, "Horizontal",
    //     { background: "#44CCFF" },
    //     $(go.Picture,
    //       { margin: 10, width: 50, height: 50, background: "red" },
    //       new go.Binding("source")),
    //     $(go.TextBlock, "Default Text",
    //       { margin: 12, stroke: "white", font: "bold 16px sans-serif" },
    //       new go.Binding("text", "name"))
    //   );

    // var model = $(go.TreeModel);
    // model.nodeDataArray =
    // [
    //   { key: "1", items: [ "Alpha", "Beta"],   source: "../assets/accets/img/dx.png" },
    //   { key: "2", parent: "1", name: "Demeter",    source: "cat2.png" },
    //   { key: "3", parent: "1", name: "Copricat",   source: "cat3.png" },
    //   { key: "4", parent: "3", name: "Jellylorum", source: "cat4.png" },
    //   { key: "5", parent: "3", name: "Alonzo",     source: "cat5.png" },
    //   { key: "6", parent: "2", name: "Munkustrap", source: "cat6.png" }
    // ];
    // myDiagram.model = model;
    this.gojs();

  },
  created() {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
