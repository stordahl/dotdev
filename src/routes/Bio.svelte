<section>
	<h2>Hi, I'm Jacob</h2>
	<p class="byline">
		Design Engineer, Web Developer, and recovering artist. I’ve been building stuff on the web for a
		decade, and still love crafting exceptional user experiences.
	</p>
	<div class="grid">
		<div class="currently">
			<p class="title">Currently</p>
			<p class="content">
				I’m a Software Engineer at <a href="https://stylitics.com">Stylitics</a>, an e-commerce B2B
				SaaS company.
			</p>
		</div>
		<div class="availability">
			<p class="title">Availability</p>
			<p class="content">I’m currently available for freelance projects through the end of 2024.</p>
		</div>
		<div class="links">
			<p class="title">Links</p>
			<div>
        <a href="mailto:jacob@stordahl.dev">Email</a>
				<a href="https://github.com/stordahl">Github</a>
				<a href="https://www.linkedin.com/in/jacobstordahl/">LinkedIn</a>
				<a href="https://bsky.app/profile/stordahl.dev">Bluesky</a>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		padding: 50px 0;
		max-width: 800px;
		margin: auto;
	}

	h2 {
		font-family: 'Basheq', serif;
		font-size: clamp(2.5rem, calc(2.5rem + 2vw), 4rem);
		font-weight: 300;
		border-bottom: 2px solid var(--orange);
		width: max-content;
		line-height: 1.2;
		margin-bottom: 1.2rem;
	}

	.byline {
		font-size: 2.5rem;
		margin-bottom: 4rem;
		line-height: 1.1;
		font-weight: 300;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-areas: 'currently currently' 'availability links';
		gap: 40px;
	}

	.title {
		font-family: 'Basheq', serif;
		font-size: clamp(1.75rem, calc(1.75rem + 2vw), 2.5rem);
	}

	.content {
		font-size: 1.75rem;
		font-weight: 300;
		line-height: 1.3;
	}

	.currently {
		grid-area: currently;
	}
	.availability {
		grid-area: availability;
	}
	.links {
		grid-area: links;
		justify-self: end;
		display: flex;
		flex-direction: column;
		align-items: flex-end;

		div {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			font-size: 1.75rem;
			font-weight: 300;
		}
	}

	.availability,
	.links {
		max-width: 300px;
	}
</style>
