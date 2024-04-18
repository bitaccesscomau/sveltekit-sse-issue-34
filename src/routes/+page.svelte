<script>
  import { onMount } from 'svelte';
  import { source } from 'sveltekit-sse';

  onMount(async function run() {
    const response = await fetch('/request-notification-broker', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'

        // You will still want to manage this in your use case,
        // I'm just commenting out for this example's purposes.
        // Authorization: `Bearer ${token}`
      }
    });

    if (response.status >= 300) {
      // Failed
      console.log('Failed reading stream.');
    } else {
      /**
       * @type {{key:string}}
       */
      const { key } = await response.json();

      // Accepted
      console.log('Reading stream successfully.');
      start(key);
    }
  });

  /**
   * @type {import("svelte/store").Readable<string>|null}
   */
  let message;
  let key = '';
  let messageOutgoing = '';

  /**
   *
   * @param {string} keyLocal
   */
  function start(keyLocal) {
    // Save it to render on the page just for this example's sake
    key = keyLocal;
    message = source(`/notifications/${keyLocal}/read`, {
      beacon: 3000
    }).select('message');
  }

  async function submit() {
    const body = JSON.stringify({ message: messageOutgoing });
    messageOutgoing = '';
    const response = await fetch(`/notifications/${key}/write`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });

    if (response.status >= 300) {
      // Failed
      console.log('Failed submitting message.');
    }
  }

  //   /**
  //    *
  //    * @param {string} url
  //    */
  //   function stop(url) {
  //     source(url).close();
  //     message = null;
  //   }
</script>

{#if !message}
  Updates will appear here.
{:else}
  {$message}
{/if}

<hr />

Currently using key<br />
<textarea value={key}></textarea>

<br />

<textarea bind:value={messageOutgoing}></textarea>
<br />
<button on:click={submit}>Submit message</button>

<p>
  This simulates a third party sending a notification to your server, your server will then send it
  to your client, in this case back to this web page.
</p>
