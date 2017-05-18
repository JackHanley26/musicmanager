(function() {

  var backoffService = function() {

    var service = {
      Backoff: Backoff
    };
    return service;
    /**
     * @func apiRequest
     * @memberof backoffService
     * @param {object} opts Options for the backoff
     * @description
     * An object that allows us to exponentially backoff on any function
     */
    function Backoff(opts) {
      opts = opts || {};
      this.ms = opts.min || 100;
      this.max = opts.max || 10000;
      this.factor = opts.factor || 2;
      this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
      this.attempts = 0;

      /**
       * @description
       * Duration of the next backoff request to make
       * @returns {number}
       */
      this.duration = function duration() {
        if (this.attempts === 0) {
          this.attempts++;
          return 0;
        }
        var ms = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
          var rand = Math.random();
          var deviation = Math.floor(rand * this.jitter * ms);
          ms = (Math.floor(rand * 10) & 1) === 0 ? ms - deviation : ms + deviation;
        }
        return Math.min(ms, this.max) | 0;
      };

      /**
       * @description
       * Resets the number of times that this backoff has been executed
       */
      this.reset = function reset() {
        this.attempts = 0;
      };
    }


  };

  angular.module('myapp')
    .service('backoffService', backoffService);

})();
