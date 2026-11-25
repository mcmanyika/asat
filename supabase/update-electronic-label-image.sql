-- Point Electronic Label Solution at the systems folder image.
update public.content_items
set
  image = '/images/systems/electronic-label-solution.png',
  image_alt = 'Smart supermarket tea and coffee aisle with electronic shelf labels',
  updated_at = now()
where category = 'system'
  and slug = 'electronic-label-solution';
