<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import {Utils, LeRoute, Display, axios} from "js-utils";
import menuNavItem from "./menuNavItemComponent.vue";

const props = defineProps({
  apiLoadMenu: Object,
  dataMenus: {
    type: [Array, Object],
    default: () => []
  },
  mode: {
    type: String,
    default: "auto"
  },
  stateChangeOn: {
    type: String,
    default: "md"
  },
  dataActiveIndex: {
    type: [String, Number],
    default: ""
  },
  id: {
    type: String,
    default: () => "nav-menu-" + Utils.randomString(6)
  },
  containerClass:{
    type: String,
    default: ""
  }
});

const menus = ref([]);
const menuLoaded = ref(false);

const isCollapse = ref(false);
const isEllipsis = ref(false);

const defaultActiveIndex = ref("");
const navMenuContent = ref(null);


// ---------- 初始化菜单 ----------
const loadMenus =  () => {
  menuLoaded.value = false
  if (Object.keys(props.dataMenus).length > 0) {
    menus.value = props.dataMenus;
    menuLoaded.value = true
    menuRefresh()
  } else {

    axios.quiet().apiRequest(props.apiLoadMenu).then(function (res_data){
      menus.value = Utils.valueGet(res_data, "data", []);
      menuLoaded.value = true
      menuRefresh()
    })


  }
};

const menuRefresh = () => {
  nextTick(function (){
    initDisplay();
    computeActiveIndex();
  });
}
// ---------- 计算 activeIndex ----------
const computeActiveIndex = () => {
  if (props.dataActiveIndex) {
    defaultActiveIndex.value = props.dataActiveIndex;
    return;
  }

  let indexs = (
      window.LeServiceRouteCurrent || window.location.pathname
  )
      .replace(/\//g, ".")
      .replace(/^\./, "")
      .split(".");

  let menuItems = navMenuContent.value?.$?.subTree?.component?.subTree?.children || [];

  let length = indexs.length;
  while (length > 0) {
    let index = indexs.slice(0, length).join(".");

    if (findIndexInMenus(menuItems, index)) return;

    // 尝试通配符
    if (length === indexs.length) {
      if (findIndexInMenus(menuItems, indexs.slice(0, length - 1).join(".") + ".*")) return;
    } else {
      if (findIndexInMenus(menuItems, index + ".*")) return;
    }
    length--;
  }
};

// ---------- 在递归菜单树中查找 index ----------
const findIndexInMenus = (menuItems, index) => {
  if (!Array.isArray(menuItems)) return false;

  for (let item of menuItems) {
    let comp = item.component;
    if (!comp) continue;

    if (comp.props?.index === index) {
      defaultActiveIndex.value = index;
      return true;
    }

    if (comp.subTree?.children) {
      if (findIndexInMenus(comp.subTree.children, index)) return true;
    }
  }
  return false;
};
const initDisplay = () => {
  if (Display.lt(props.stateChangeOn)) {
    if("horizontal" === props.mode){
      isEllipsis.value=true
      isCollapse.value=false
    }else{
      isEllipsis.value=false
      isCollapse.value=true
    }
  } else {
    isCollapse.value=false
    isEllipsis.value=false
  }
};


// ---------- 回调 ----------
const menuCallback = (value) => {
  if (typeof window.menuCallback === "function") {
    return window.menuCallback(value);
  }
};

// ---------- 生命周期 ----------
onMounted( () => {
  loadMenus();
});

</script>

<template>
  <div :id="id" :class="containerClass">
    <el-menu
        v-if="menuLoaded"
        ref="navMenuContent"
        :default-active="defaultActiveIndex"
        :mode="mode"
        :collapse="isCollapse"
        :ellipsis="isEllipsis"
        :unique-opened="true"
    >
      <slot name="prepend"></slot>

      <menu-nav-item
          v-for="(menu, key) in menus"
          :menu="menu"
          :key="key"
          :index="menu.index || String(key)"
          @callback="menuCallback"
      >
      </menu-nav-item>

      <slot name="append"></slot>
    </el-menu>
  </div>
</template>

