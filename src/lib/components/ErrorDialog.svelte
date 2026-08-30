<script lang="ts">
  const { id, message }: { id: string; message: string } = $props();
</script>

<dialog class="border-none bg-inherit" {id}>
  <div
    class="grid w-60 grid-cols-1 grid-rows-[2fr_1fr] gap-4 rounded-2xl border-2 border-solid border-red-700 bg-white p-2.5"
  >
    <p>
      {message}
    </p>
    <button
      class="overflow-hidden rounded-xl border-none bg-green-700 text-white"
      command="close"
      commandfor={id}
    >
      OK
    </button>
  </div>
</dialog>
