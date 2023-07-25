import type { App} from 'vue'
import * as svg from '@element-plus/icons-vue';
import SvgIcon from '@/components/SvgIcon/index.vue'
export default function (app: App) {
  //Svg矢量图标变为全局组件
  app.component('svg-icon', SvgIcon)
  const icons = svg as any;
  //把element-plus里面全部的ICON变为全局组件
	for (const i in icons) {
		app.component(`ele-${icons[i].name}`, icons[i]);
	}
}



