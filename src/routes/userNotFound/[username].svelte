<script context="module">
  export async function load({ fetch, page }) { 
    const username = page.params.username
    return {
      props: {
        username: username
      }
    }
  }
</script>

<script>
  export let username
</script>

<h1>{username} not found</h1>