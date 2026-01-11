export default {
  async fetch(request: Request) {
    return new Response('SCTEC Worker running', {
      status: 200,
      headers: { 'content-type': 'text/plain; charset=utf-8' }
    });
  }
};
