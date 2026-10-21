'use strict';
// Keep the official reservation flow and attribution. Never count a click as a booking.
const bookingBase = 'https://designer.my.site.com/scheduling?slug=mid-ad-mk';
const incoming = new URLSearchParams(location.search);
const attributionKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid','ttclid','affiliate_id','source','platform','media','ad_source'];
const bookingURL = new URL(bookingBase);
for (const key of attributionKeys) {
  const value = incoming.get(key);
  if (value && value.length <= 2000) bookingURL.searchParams.set(key,value);
}
bookingURL.searchParams.set('lp_variant','sales-to-other-roles');
window.dataLayer = window.dataLayer || [];
for (const link of document.querySelectorAll('[data-booking]')) {
  link.href = bookingURL.href;
  link.addEventListener('click',()=>{
    window.dataLayer.push({event:'lp_cta_click',lp:'midcareer_sales_change',section:link.dataset.position,selected_role:document.querySelector('[role=tab][aria-selected=true]')?.dataset.role});
  });
}
const tabs = Array.from(document.querySelectorAll('[role=tab]'));
function activateTab(tab,focus = false) {
  for (const item of tabs) {
    const active = item === tab;
    item.setAttribute('aria-selected',String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  }
  if(focus) tab.focus();
  window.dataLayer.push({event:'lp_role_select',lp:'midcareer_sales_change',role:tab.dataset.role});
}
for (const tab of tabs) {
  tab.addEventListener('click',()=>activateTab(tab));
  tab.addEventListener('keydown',event=>{
    const index = tabs.indexOf(tab);
    let next;
    if(event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
    if(event.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
    if(event.key === 'Home') next = tabs[0];
    if(event.key === 'End') next = tabs[tabs.length - 1];
    if(next){event.preventDefault();activateTab(next,true);}
  });
}

// Keep the sticky action clear of both visible reservation actions.
const stickyAction = document.querySelector('.sticky-bar');
const mainBookingAction = document.querySelector('[data-position="hero"]');
const finalBookingSection = document.getElementById('reservation');
if ('IntersectionObserver' in window) {
  const visibleBookingAreas = new Set();
  const bookingVisibility = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visibleBookingAreas.add(entry.target);
      else visibleBookingAreas.delete(entry.target);
    }
    stickyAction.hidden = visibleBookingAreas.size > 0;
  }, {threshold:0});
  bookingVisibility.observe(mainBookingAction);
  bookingVisibility.observe(finalBookingSection);
} else { stickyAction.hidden = false; }
