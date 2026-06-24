import torch.nn as nn
from ultralytics.nn.modules import Conv
from .dsconv import DSConv

class DSCBottleneck(nn.Module):
    def __init__(self, c, shortcut=True):
        super().__init__()
        self.cv1 = DSConv(c, c, 3)
        self.cv2 = DSConv(c, c, 3)
        self.add = shortcut

    def forward(self, x):
        y = self.cv2(self.cv1(x))
        if self.add:
            return x + y
        return y

class DSC_C3k2(nn.Module):
    def __init__(self, c1, c2, shortcut=False, e=0.25):
        super().__init__()
        hidden = int(c2 * e)
        self.cv1 = Conv(c1, hidden, 1, 1)
        self.m = nn.Sequential(
            DSCBottleneck(hidden, shortcut),
            DSCBottleneck(hidden, shortcut)
        )
        self.cv2 = Conv(hidden, c2, 1, 1)

    def forward(self, x):
        x = self.cv1(x)
        x = self.m(x)
        x = self.cv2(x)
        return x
