import fs from 'fs';
import got from 'got';
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const page_url: string = 'https://downloads.khinsider.com';
const vgmUrl: string = 'https://mail.downloads.khinsider.com/game-soundtracks/album/god-of-war-playstation-soundtrack';

const is_a_song = (link: any) => {
    return !link.id.includes('songlist_header') && !link.id.includes('songlist_footer');
};


(async () => {
    try {
        const response = await got(vgmUrl);
        const dom = new JSDOM(response.body);
        const song_list = dom.window.document.querySelector('#songlist');
        const songs: HTMLTableRowElement[] = [...song_list.querySelectorAll('tr')].filter(is_a_song);
        songs.forEach(async (song: HTMLTableRowElement) => {
            // every element have 7 childs
            // we need only the [2] for name and [3] for duration of the song
            // all of them have the link for the download
            const information_song= song.querySelectorAll('td');
            // get the link of the song
            const response_song = await got(page_url + information_song[2].querySelector('a').href);
            const dom_song = new JSDOM(response_song.body);
            const player = dom_song.window.document.querySelector('#audio');
            const link = player.getAttribute('src');
            console.log(information_song[2].querySelector('a').textContent, '-', information_song[3].querySelector('a').textContent);
            console.log(link);
        });
    } catch (err) {
        console.log(err);
    }
})();