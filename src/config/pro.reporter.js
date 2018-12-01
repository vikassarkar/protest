
const reportsPath = require("./reporter.config");
const path = require("path");

/**video reporter plugin setup */
const VideoReporter = require("protractor-video-reporter");
VideoReporter.prototype.jasmineStarted = function () {
    let self = this;
    if (self.options.singleVideo) {
        const videoPath = path.join(self.options.baseDirectory, "protractor-specs.avi");
        self._startScreencast(videoPath);
        if (self.options.createSubtitles) {
            self._subtitles = [];
            self._jasmineStartTime = new Date();
        }
    }
};

const videoReport = new VideoReporter({
    baseDirectory: reportsPath.videoReportPath,
    saveSuccessVideos: true,
    createSubtitles: true,
    singleVideo: true,
    ffmpegCmd: path.normalize("./node_modules/ffmpeg-binaries/bin/ffmpeg.exe"),
    ffmpegArgs: [
        "-f", "gdigrab",
        "-framerate", "24",
        "-i", "desktop",
        "-q:v", "10",
        "-s", "1920x1080",
    ]
});

/**pretty html reporter plugin setup */
const PrettyReporter = require("protractor-pretty-html-reporter").Reporter;
const sanityReport = new PrettyReporter({
    path: reportsPath.mgmtReportPath,
    screenshotOnPassed: true,
    highlightSuspectLine: true
});

/**console spec reporter plugin setup */
const SpecReporter = require("jasmine-spec-reporter").SpecReporter;
const specReport = new SpecReporter({
    displayFailuresSummary: true,
    displayFailuredSpec: true,
    displaySuiteNumber: true,
    displaySpecDuration: true
});

module.exports = {
    specReport:specReport,
    sanityReport:sanityReport,
    videoReport:videoReport
}
