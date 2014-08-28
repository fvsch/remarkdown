<?php
  header('Content-Type:text/plain');
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>{block:PostSummary}{PostSummary} &mdash; {/block:PostSummary}{Title}</title>
{block:Description}<meta name="description" content="{MetaDescription}">{/block:Description}
<link rel="alternate" type="application/rss+xml" href="{RSS}">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
<?php
  include('tumblr.css');
?>
</style>
</head>

<body data-rmd>

<div class="container">

{block:PermalinkPage}
<nav id="sitenav">
  <a href="/">{Title}</a>
  &nbsp;·&nbsp;
  <a href="/tagged/✍">✍ my own posts</a>
</nav>
{/block:PermalinkPage}

{block:IndexPage}
<section id="sitebanner" data-rmd="h1-underline">
  <h1><a href="/">{Title}</a></h1>
{block:Description}
  <p>{Description}</p>
{/block:Description}
</section>
{/block:IndexPage}

<div class="posts">

{block:NoSearchResults}
<h2>Sorry, nothing found for &ldquo;{SearchQuery}&rdquo;.</h2>
{/block:NoSearchResults}

{block:TagPage}
<div class="tag-header" data-rmd="h2-underline">
<h2>Posts tagged {Tag}</h2>
</div>
{/block:TagPage}

{block:Posts}
  {block:IndexPage}<hr>{/block:IndexPage}
  <article class="{PostType}{block:RebloggedFrom} reblog{/block:RebloggedFrom}{block:NotReblog} original{/block:NotReblog}">
    {block:Text}
      {block:Title}
        {block:PermalinkPage}
        <div class="post-title" data-rmd="h1-underline">
          <h1>{Title}</h1>
        </div>
        {/block:PermalinkPage}
        {block:IndexPage}
        <div class="post-title"{block:PermalinkPage} data-rmd="h2-underline"{/block:PermalinkPage}>
          <h2><a href="{Permalink}">{Title}</a></h2>
        </div>
        {/block:IndexPage}
      {/block:Title}
        <div class="maintext">
          {Body}
        </div>
      {block:More}
      <p class="more"><a href="{Permalink}">Read More</a></p>
      {/block:More}
    {/block:Text}

    {block:Photo}
      <figure class="full">
        <img src="{PhotoURL-HighRes}" alt="{PhotoAlt}">
        <div class="maintext">
        {block:Caption}
          <figcaption>{Caption}</figcaption>
        {/block:Caption}
        </div>
      </figure>
    {/block:Photo}

    {block:Photoset}
      <figure class="full">
        {Photoset-700}
      </figure>
      <div class="maintext">
      {block:Caption}
        {Caption}
      {/block:Caption}
      </div>
    {/block:Photoset}

    {block:Quote}
      <blockquote class="main-quote">
        <p>{Quote}</p>
      </blockquote>
      {block:Source}
      <div class="maintext">
        &mdash; {Source}
      </div>
      {/block:Source}
    {/block:Quote}

    {block:Link}
      <div class="post-title">
        <h2 class="link"><a href="{URL}" class="external">{Name}</a></h2>
      </div>
      {block:Description}
      <div class="maintext">
        {Description}
      </div>
      {/block:Description}
    {/block:Link}

    {block:Chat}
      {block:Title}
        {block:PermalinkPage}
        <div class="post-title" data-rmd="h1-underline">
          <h1>{Title}</h1>
        </div>
        {/block:PermalinkPage}
        {block:IndexPage}
        <div class="post-title">
          <h2>{Title}</h2>
        </div>
        {/block:IndexPage}
      {/block:Title}
      <div class="maintext">
        {block:Lines}
        <p class="{Alt}">
          {block:Label}
          <b>{Label}</b>
          {/block:Label}
          {Line}
        </p>
        {/block:Lines}
      </div>
    {/block:Chat}

    {block:Audio}
      {AudioEmbed-640}
      {block:Caption}
        {Caption}
      {/block:Caption}
    {/block:Audio}

    {block:Video}
      <figure class="full">
      {Video-700}
      {block:Caption}
        <figcaption>
          {Caption}
        </figcaption>
      {/block:Caption}
      </figure>
    {/block:Video}

    {block:Date}
      <footer class="meta">
        <p>
          <a href="{Permalink}">{TimeAgo}</a>
          {block:RebloggedFrom}
          — <a href="{ReblogRootURL}">by {ReblogRootName}</a>
          {/block:RebloggedFrom}
          {block:HasTags}
          {block:Tags}
          <span class="tag"><a href="{TagURL}">#{Tag}</a></span>
          {/block:Tags}
          {/block:HasTags}
        </p>
      </footer>
    {/block:Date}

  </article>

{/block:Posts}

</div><!--.posts-->
        
{block:Pagination}
<p class="pagination">
  {block:PreviousPage}<span class="prev"><a href="{PreviousPage}" class="previous">Previous</a> &nbsp;·&nbsp;</span>{/block:PreviousPage}
  <span class="page-numbers">Page&nbsp;{CurrentPage}&thinsp;/&thinsp;{TotalPages}</span>
  {block:NextPage}<span class="next">&nbsp;·&nbsp; <a href="{NextPage}">Next</a></span>{/block:NextPage}
</p>
{/block:Pagination}

</div><!--.container-->

<script>
void function remove_pesky_via() {
  var sel = '.maintext > p:nth-last-child(-1n+2), .maintext > * > p:nth-last-child(-1n+2)';
  var paras = document.querySelectorAll(sel);
  for (var i=0, l=paras.length; i<l; i++) {
    var text = paras[i].textContent.trim();
    if (/^\(.*via.*\)$/.test(text)) {
      paras[i].parentNode.removeChild(paras[i]);
    }
  }
}();

void function toggle_those_blockquotes() {
  var makeBtn = function(para) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quote-toggle';
    btn.innerHTML = '<span> {-} Hide quote </span><span> {+} Show quote </span>';
    btn.addEventListener('click', function(event){
      var btn = event.currentTarget;
      var quote = btn.parentElement.nextElementSibling;
      btn.classList.toggle('hidden');
      quote.classList.toggle('hidden');
    })
    para.appendChild(btn);
  }
  var test = function(para) {
    // looking for the <p><a>someone</a>:</p> pattern.
    var link = para.querySelector('a:last-of-type');
    if (link !== null && /[a-z0-9]+/.test(link.textContent.trim())) {
      var nxt = link.nextSibling;
      var end = para.lastChild;
      if (nxt !== end) return;
      if (end.textContent.trim() === ':') {
        makeBtn(para);
      }
    }
  }
  var quotes = document.querySelectorAll('.maintext p + blockquote');
  for (var i=0, l=quotes.length; i<l; i++) {
    test(quotes[i].previousElementSibling);
  }
}();
</script>

</body>
</html>
