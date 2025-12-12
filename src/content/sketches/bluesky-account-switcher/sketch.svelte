<script lang="ts">
	import PlusIcon from "./PlusIcon.svelte";
  import ProfileIcon from "./ProfileIcon.svelte";
	import SignOutIcon from "./SignOutIcon.svelte";

  const profileUrl = "https://bsky.app/profile/stordahl.dev";
  let dropDownState = $state<"open" | "closed">("closed");

  function toggleDropDown() {
    if (dropDownState === "open") {
      dropDownState = "closed"; 
    } else {
      dropDownState = "open";
    }
  }
</script>

<div class="sketch">
  <button aria-label="Switch Accounts" onclick={toggleDropDown} class:open={dropDownState === "open"}>
    <div class="avatar">
      <div>
        <img src="https://cdn.bsky.app/img/avatar_thumbnail/plain/did:plc:6ghbu76mogjyfcvx446mep5o/bafkreicuurghr37bo6zvzyciw72ximnc7ul7nmzftvoba5qyfpeoksawhq@jpeg" alt=""/>
      </div>  
    </div> 
    <div class="info">
      <span class="name">Jacob Stordahl 🏳️‍🌈</span>
      <span class="handle">@stordahl.dev</span>
    </div> 
    <div class="elipse">
      <svg fill="none" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="#ABB8C9" stroke="none" stroke-width="0" stroke-linecap="butt" stroke-linejoin="miter" fill-rule="evenodd" clip-rule="evenodd" d="M2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm16 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm-6-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"></path>
      </svg>
    </div>
    {#if dropDownState === "open"}
    <div id="dropdown">
      <a href={profileUrl}>
        <ProfileIcon /> 
        <span>Go to profile</span>
      </a> 
      <a href={profileUrl}>
        <PlusIcon />
        <span>Add another account</span>
      </a> 
      <a href={profileUrl}>
        <SignOutIcon />
        <span>Sign out</span>
      </a> 
    </div>
    {/if}
  </button>
</div>

<style>
  .sketch {
    border-radius: 20px;
    width: 100%;
    height: 500px;
    display: flex;
    background-color: #151d28;
    align-items: center;
    justify-content: center;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";

    button {
      transform: translateY(-85px);
    }
  }

  #dropdown {
    width: 200px;
    border-radius: 8px;
    padding: 4px;
    border: 1px solid rgb(44, 58, 78);
    background-color: rgb(28, 39, 54);
    box-shadow: rgba(0, 0, 0, 0.4) 0px 10px 15px -3px, rgba(0, 0, 0, 0.4) 0px 4px 6px -4px, rgb(0, 0, 0) 0px 0px 0px;
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    display: flex;
    flex-direction: column;

    a {
      display: grid;
      grid-template-columns: 20px auto;
      align-items: center;
      gap: 16px;
      padding: 8px 10px;
      border-radius: 4px;
      min-height: 32px;
      color: rgb(251, 251, 254);
      text-align: left;
      font-weight: 500;
      
      span {
        white-space: nowrap;
      }

      &:hover {
        background-color: #212E3F;
        &:after {
          display: none;
        }
      }
    }
  }

  button {
    --transition-duration: 0.1s;
    --transition-timing: cubic-bezier(0.77, 0, 0.175, 1);
    --transition-delay: 0s;
    position: relative;
    width: 200px;
    height: 48px;
    border-radius: 999px;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    gap: 6px;
    padding-left: 16px;
    padding-right: 12px;
    transition-delay: 50ms;
    background-color: unset;

    .avatar {
      z-index: 2;
      div {
        transition: transform var(--transition-duration) var(--transition-timing) 0s;
        width: 48px;
        height: 48px;
        border-radius: 100px;
        overflow: hidden;
      }
    }

    .info, .elipse {
      transition: opacity var(--transition-duration) var(--transition-timing) var(--transition-delay);
      opacity: 0%;
    }

    .info {
      margin-left: -20px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      z-index: 1;
      span {
        white-space: nowrap;
        color: #fff;
      }
      span.name {
        font-size: 0.8rem;
        font-weight: 700;
      }
      span.handle {
        color: rgb(171, 184, 201);
        font-size: 0.7rem; 
        font-weight: 500;
        line-height: 15px;
      }
    }

    .elipse {
      color: rgb(171, 184, 201);
    }

    &:hover,
    &.open {
      cursor: pointer;
      background-color: #1C2736;
      .info, .elipse {
        opacity: 100%;
        transition-delay: 0s;
      }
      .avatar {
        div {
          transform: scale(0.666667) translateX(-22px);
        }
      }
    }
  }
</style>
