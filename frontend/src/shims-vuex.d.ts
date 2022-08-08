//este archivo es para que pueda hacer this.$store
import { Store } from './store';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store;
    }
}
