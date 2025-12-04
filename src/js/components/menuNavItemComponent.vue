<script setup>
import {computed, defineOptions, defineExpose, ref} from "vue";
defineOptions({
  name: "menu-nav-item"
});
const props = defineProps({
  menu: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: String,
    default: "0"
  }
});
const refMenuItems = ref([]);
defineExpose({
  props,
  refMenuItems
})
const emit = defineEmits(["callback"]);

// 是否有子菜单
const hasChildren = computed(() => {
  const children = props.menu?.children;
  return Array.isArray(children) && children.length > 0;
});
</script>
<template>
  <!-- 没有子节点的菜单 -->
  <el-menu-item
      v-if="!hasChildren"
      :index="menu.index || index"
  >
    <span>
      <a
          href="javascript:void(0)"
          v-if="menu.target === '_callback'"
          @click="$emit('callback', menu.href || '')"
      >
        {{ menu.name || '' }}
      </a>

      <a
          v-else
          :href="menu.href || 'javascript:void(0)'"
          :target="menu.target || '_self'"
      >
        {{ menu.name || '' }}
      </a>
    </span>
  </el-menu-item>

  <!-- 有子节点的菜单 -->
  <el-sub-menu
      v-else
      :index="menu.index || index"
      :persistent="false"
  >
    <!-- 子菜单标题 slot（Vue3 写法） -->
    <template #title>
      <slot :item="menu">
        <a
            :href="menu.href || 'javascript:void(0)'"
            :target="menu.target || '_self'"
        >
          {{ menu.name || '' }}
        </a>
      </slot>
    </template>

    <!-- 递归子菜单 -->
    <menu-nav-item
        ref="refMenuItems"
        v-for="(child, key) in menu.children"
        :key="key"
        :menu="child"
        :index="child.index || (index + '-' + key)"
        @callback="(value) => emit('callback', value)"
    >
    </menu-nav-item>
  </el-sub-menu>
</template>





