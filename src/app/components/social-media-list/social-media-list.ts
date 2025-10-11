import { Component } from '@angular/core';

@Component({
  selector: 'app-social-media-list',
  imports: [],
  standalone: true,
  templateUrl: './social-media-list.html',
  styleUrl: './social-media-list.scss'
})
export class SocialMediaList {

  SocialMedia = [
    {
      id: 'instagram',
      url: 'https://www.instagram.com/codebyxerenity/',
      image: '/assets/image/instagram.png'
    },
    {
      id: 'threads',
      url: 'https://www.threads.com/codebyxerenity/',
      image: '/assets/image/threads.png'
    },
    {
      id: 'tiktok',
      url: 'https://www.tiktok.com/codebyxerenity/',
      image: '/assets/image/tiktok.png'
    },
  ];

  Marketplace = [
    {
      id: 'shopee',
      url: 'https://www.shopee.com/codebyxerenity/',
      image: '/assets/image/shopee.png'
    },
    {
      id: 'tokopedia',
      url: 'https://www.tokopedia.com/codebyxerenity/',
      image: '/assets/image/tokopedia.png'
    }
  ];

  handleNavigate(url: string) {
    window.open(url);
  }
}
