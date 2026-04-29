from abc import ABC, abstractmethod
class Notifier(ABC):
    @abstractmethod
    def send(self, text): ...
class EmailNotifier(Notifier):
    def send(self, text): print("EMAIL:", text)
class SlackNotifier(Notifier):
    def send(self, text): print("SLACK:", text)
for n in [EmailNotifier(), SlackNotifier()]:
    n.send("hello")
