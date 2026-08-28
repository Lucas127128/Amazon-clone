<script lang="ts">
  const { orderId }: { orderId: string } = $props();
</script>

<div class="grid shrink grid-cols-[2fr_1fr] grid-rows-[0.7fr_1fr]">
  <div class="col-span-2 mr-1.25 font-medium sm:mr-0">Order ID:</div>
  <span>{orderId}</span>
  {let showTick = $state(false)}
  <button
    class="justify-self-start border-none bg-inherit p-0"
    onclick={async () => {
      await navigator.clipboard.writeText(orderId);
      showTick = true;
      setTimeout(() => {
        showTick = false;
      }, 3000);
    }}
  >
    {#if showTick}
      <img src="/images/icons/tick.svg" alt="tick icon" />
    {:else}
      <img src="/images/icons/copy.svg" alt="copy icon" />
    {/if}
  </button>
</div>
