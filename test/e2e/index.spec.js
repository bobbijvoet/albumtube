describe('the albumtube main page', function() {
  it('should get the albums of arpanet', function() {
    browser.get('http://localhost:9000/');

    element(by.model('artist')).clear();
    element(by.model('artist')).sendKeys('arpanet');
    element(by.css('[ng-click="findAlbumsForArtist()"]')).click();

    var todoList = element.all(by.repeater('album in albums'));
    //Arpanet has currently 5 known albums by lastfm
    expect(todoList.count()).toEqual(5);
  });
});