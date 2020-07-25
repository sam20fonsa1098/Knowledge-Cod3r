<template>
  <footer class="footer">
      <span>Copyright <strong>Cod3r</strong> @2015-2018</span>
  </footer>
</template>

<script>
export default {
    name: "Footer"
}
</script>

<style>
    .footer {
        grid-area: footer;
        background-color: #ddd;
        color: #333;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 10px;
    }
</style>