<script lang="ts">
  import '../app.css';

  import { Cart, setCartContext } from '#lib/data/cart.svelte.ts';

  const { children } = $props();
  setCartContext(new Cart());
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="text-scale" content="scale" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link
    rel="icon"
    href="../images/favicon/favicon.ico"
    type="image/x-icon"
  />
</svelte:head>

{@render children()}
